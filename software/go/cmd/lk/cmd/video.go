package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"shared"
	"sort"
	"strings"
	"time"

	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
)

var videoCmd = &cobra.Command{
	Use:  "video",
	Args: cobra.MatchAll(cobra.ExactArgs(1), cobra.OnlyValidArgs),
	Run: func(cmd *cobra.Command, args []string) {
		// Get the directory path from args
		dirPath := args[0]
		start := time.Now()
		defer func() {
			fmt.Println("Total time:", time.Since(start))
		}()

		// Create the target directory if it doesn't exist
		if err := os.MkdirAll(dirPath, 0755); err != nil {
			println("Error creating target directory:", err.Error())
			return
		}
		println("Target directory created or already exists:", dirPath)

		// Check if directory is empty
		files, err := os.ReadDir(dirPath)
		if err != nil {
			println("Error reading directory:", err.Error())
			return
		}

		// If directory is empty, copy files from GoPro directory
		if len(files) == 0 {
			goproPath := "/run/media/lane/disk/DCIM/101GOPRO"
			println("Directory is empty, copying files from GoPro directory:", goproPath)

			// Check if GoPro directory exists
			if _, err := os.Stat(goproPath); os.IsNotExist(err) {
				println("GoPro directory does not exist:", goproPath)
				return
			}

			// Read GoPro directory contents
			goproFiles, err := os.ReadDir(goproPath)
			if err != nil {
				println("Error reading GoPro directory:", err.Error())
				return
			}

			// Copy all files from GoPro directory
			for _, file := range goproFiles {
				if file.IsDir() {
					continue // Skip subdirectories
				}

				sourcePath := filepath.Join(goproPath, file.Name())
				destPath := filepath.Join(dirPath, file.Name())

				println("Copying:", file.Name())

				// Copy file
				if err := copyFile(sourcePath, destPath); err != nil {
					println("Error copying file", file.Name(), ":", err.Error())
					continue
				}
			}
			println("Finished copying files from GoPro directory")

			// Re-read directory contents after copying
			files, err = os.ReadDir(dirPath)
			if err != nil {
				println("Error re-reading directory after copy:", err.Error())
				return
			}
		} else {
			println("Directory is not empty, proceeding with existing files")
		}

		// Create nonvideofiles folder if it doesn't exist
		if err := os.MkdirAll(filepath.Join(dirPath, "nonvideofiles"), 0755); err != nil {
			println("Error creating nonvideofiles folder:", err.Error())
			return
		}
		println("nonvideofiles folder created or already exists")

		// Move non-mp4 files (except file_list.txt) to nonvideofiles folder
		for _, file := range files {
			if file.IsDir() {
				continue // Skip directories
			}

			fileName := filepath.Base(file.Name())

			// Skip file_list.txt and mp4 files
			if fileName == "file_list.txt" || strings.HasSuffix(strings.ToLower(fileName), ".mp4") {
				continue
			}

			// Copy the file to nonvideofiles folder
			sourcePath := filepath.Join(dirPath, fileName)
			destPath := filepath.Join(dirPath, "nonvideofiles", fileName)
			println("sourcepath", sourcePath)
			println("destfile", destPath)

			// Copy file
			err = os.Rename(sourcePath, destPath)
			if err != nil {
				fmt.Println("Error moving file:", err)
				return
			}
			// if err := copyFile(sourcePath, destPath); err != nil {
			// 	println("Error copying file", fileName, ":", err.Error())
			// } else {
			// 	// Delete original file after successful copy
			// 	if err := os.Remove(sourcePath); err != nil {
			// 		println("Error deleting original file", fileName, ":", err.Error())
			// 	} else {
			// 		println("Moved:", fileName)
			// 	}
			// }
		}

		// Build file_list.txt with sorted MP4 filenames in concat demuxer format
		var mp4Files []string
		for _, file := range files {
			if file.IsDir() {
				continue
			}
			name := file.Name()
			lower := strings.ToLower(name)
			if lower == "output.mp4" {
				continue
			}
			if strings.HasSuffix(lower, ".mp4") {
				mp4Files = append(mp4Files, filepath.Base(name))
			}
		}
		sort.Strings(mp4Files)

		var builder strings.Builder
		for _, name := range mp4Files {
			escaped := strings.ReplaceAll(name, "'", "'\\''")
			fmt.Fprintf(&builder, "file '%s'\n", escaped)
		}
		listPath := filepath.Join(dirPath, "file_list.txt")
		if _, statErr := os.Stat(listPath); statErr == nil {
			println("file_list.txt already exists, skipping generation")
		} else if os.IsNotExist(statErr) {
			if err := os.WriteFile(listPath, []byte(builder.String()), 0644); err != nil {
				println("Error writing file_list.txt:", err.Error())
				return
			}
			println("Wrote:", listPath)
		} else {
			println("Error checking file_list.txt:", statErr.Error())
			return
		}

		// If output.mp4 does not exist, run ffmpeg to concatenate
		outputPath := filepath.Join(dirPath, "output.mp4")
		if _, err := os.Stat(outputPath); os.IsNotExist(err) {

			log.Info("Creating output.mp4...")

			// Prepare ffmpeg command with progress to stdout
			cmd := exec.Command("nix-shell", "-p", "ffmpeg", "--run", "ffmpeg -hide_banner -nostats -progress pipe:1 -f concat -safe 0 -i file_list.txt -c copy output.mp4")
			cmd.Dir = dirPath

			err := cmd.Run()
			shared.HandleError(err)

			log.Info("Created", "newFile", outputPath)
		} else if err == nil {
			println("output.mp4 already exists, skipping ffmpeg")
		} else {
			println("Error checking output.mp4:", err.Error())
		}
	},
}

//var processCmd = &cobra.Command{Use: ""}

// copyFile copies a file from src to dst
func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = destFile.ReadFrom(sourceFile)
	if err != nil {
		return err
	}

	return destFile.Sync()
}

func init() {
	rootCmd.AddCommand(videoCmd)
}
