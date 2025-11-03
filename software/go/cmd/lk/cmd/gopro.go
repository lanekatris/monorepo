package cmd

import (
	"fmt"
	"os"
	"syscall"

	"github.com/spf13/cobra"
)

var goproCmd = &cobra.Command{
	Use: "gopro",
	// Args: cobra.MatchAll(cobra.ExactArgs(1), cobra.OnlyValidArgs),
	Run: func(cmd *cobra.Command, args []string) {
	},
}

var goproUnmountCmd = &cobra.Command{
	Use:   "unmount [mount-point]",
	Short: "Unmount the GoPro disk",
	Long:  "Unmount the GoPro disk at the specified mount point (default: /run/media/lane/disk)",
	Args:  cobra.MaximumNArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		mountPoint := "/run/media/lane/disk"
		
		// Allow custom mount point as argument
		if len(args) > 0 {
			mountPoint = args[0]
		}
		
		// Check if the mount point exists
		if _, err := os.Stat(mountPoint); os.IsNotExist(err) {
			fmt.Printf("Mount point %s does not exist\n", mountPoint)
			return
		}
		
		fmt.Printf("Unmounting %s...\n", mountPoint)
		
		// Try gentle unmount first
		err := syscall.Unmount(mountPoint, 0)
		if err != nil {
			fmt.Printf("Gentle unmount failed, trying force unmount...\n")
			// If gentle unmount fails, try with MNT_FORCE flag
			err = syscall.Unmount(mountPoint, syscall.MNT_FORCE)
			if err != nil {
				fmt.Printf("Error unmounting %s: %v\n", mountPoint, err)
				fmt.Printf("You may need to run with sudo or check if any processes are using the mount point\n")
				return
			}
		}
		
		fmt.Printf("Successfully unmounted %s\n", mountPoint)
	},
}

func init() {
	goproCmd.AddCommand(goproUnmountCmd)
	rootCmd.AddCommand(goproCmd)
}
