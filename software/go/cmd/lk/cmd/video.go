package cmd

import (
	"fmt"
	"os"
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
			// fmt.Println("Total time:", time.Since(start))
			log.Info("Done", "TotalTime", time.Since(start).String())
		}()

		// Create the target directory if it doesn't exist
		if err := os.MkdirAll(dirPath, 0755); err != nil {
			println("Error creating target directory:", err.Error())
			return
		}
		log.Info("Target directory created/skipped")

		// Check if directory is empty
		files, err := os.ReadDir(dirPath)
		if err != nil {
			println("Error reading directory:", err.Error())
			return
		}

		// If directory is empty, copy files from GoPro directory
		if len(files) == 0 {
			// goproPath := "/run/media/lane/disk/DCIM/101GOPRO" // hero 5
			goproPath := "/run/media/lane/disk/DCIM/101GOPRO" // hero 5
			log.Info("Target directory empty, copying...")

			// Check if GoPro directory exists
			if _, err := os.Stat(goproPath); os.IsNotExist(err) {
				log.Error("GoPro directory does not exist:", goproPath)
				return
			}

			// Read GoPro directory contents
			goproFiles, err := os.ReadDir(goproPath)
			if err != nil {
				log.Error("Error reading GoPro directory:", err.Error())
				return
			}

			// Copy all files from GoPro directory
			for i, file := range goproFiles {
				if file.IsDir() {
					log.Debug("Skipped", "directory", file.Name())
					continue // Skip subdirectories
				}

				sourcePath := filepath.Join(goproPath, file.Name())
				destPath := filepath.Join(dirPath, file.Name())

				log.Info("Copying", "file", file.Name(), "current", i+1, "total", len(goproFiles))

				// Copy file
				if err := copyFile(sourcePath, destPath); err != nil {
					println("Error copying file", file.Name(), ":", err.Error())
					continue
				}
			}
			log.Info("Finished copying files from GoPro directory")

			// Re-read directory contents after copying
			files, err = os.ReadDir(dirPath)
			if err != nil {
				println("Error re-reading directory after copy:", err.Error())
				return
			}
		} else {
			log.Info("Directory is not empty, proceeding with existing files")
		}

		// Create nonvideofiles folder if it doesn't exist
		if err := os.MkdirAll(filepath.Join(dirPath, "nonvideofiles"), 0755); err != nil {
			println("Error creating nonvideofiles folder:", err.Error())
			return
		}
		log.Info("Directory exists/created", "name", "nonvideofiles")

		// Move non-MP4 files (except file_list.txt) to nonvideofiles folder
		for _, file := range files {
			if file.IsDir() {
				continue // Skip directories
			}

			fileName := filepath.Base(file.Name())

			// Skip file_list.txt and MP4 files
			if fileName == "file_list.txt" || strings.HasSuffix(strings.ToLower(fileName), ".mp4") {
				continue
			}

			// Copy the file to nonvideofiles folder
			sourcePath := filepath.Join(dirPath, fileName)
			destPath := filepath.Join(dirPath, "nonvideofiles", fileName)
			// println("sourcepath", sourcePath)
			// println("destfile", destPath)

			// Copy file
			err = os.Rename(sourcePath, destPath)
			if err != nil {
				fmt.Println("Error moving file:", err)
				return
			}
		}

		// Build file_list.txt with sorted MP4 filenames in concat demuxer format
		var MP4Files []string
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
				MP4Files = append(MP4Files, filepath.Base(name))
			}
		}
		sort.Strings(MP4Files)

		var builder strings.Builder
		for _, name := range MP4Files {
			escaped := strings.ReplaceAll(name, "'", "'\\''")
			fmt.Fprintf(&builder, "file '%s'\n", escaped)
		}
		listPath := filepath.Join(dirPath, "file_list.txt")
		if _, statErr := os.Stat(listPath); statErr == nil {
			log.Info("file_list.txt already exists, skipping generation")
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

		// If output.MP4 does not exist, run ffmpeg to concatenate
		outputPath := filepath.Join(dirPath, "output.MP4")
		if _, err := os.Stat(outputPath); os.IsNotExist(err) {

			log.Info("Creating output.MP4...")

			// Prepare ffmpeg command with progress to stdout
			_, err := shared.ExecOnHost(shared.ExecOnHostArgs{
				Name:      "nix-shell",
				Args:      []string{"-p", "ffmpeg", "--run", "ffmpeg -hide_banner -nostats -progress pipe:1 -f concat -safe 0 -i file_list.txt -c copy output.MP4"},
				Directory: dirPath,
			})

			shared.HandleError(err)

			log.Info("Created", "newFile", outputPath)
		} else if err == nil {
			log.Info("output.MP4 already exists, skipping ffmpeg")
		} else {
			println("Error checking output.MP4:", err.Error())
		}
	},
}

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
