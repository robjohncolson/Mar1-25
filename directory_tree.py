#!/usr/bin/env python3
import os
import sys
from pathlib import Path

def print_directory_tree(directory='.', prefix='', skip_dirs=None, file=None):
    """
    Print the directory tree structure starting from the specified directory.
    
    Parameters:
    - directory: Path to the directory to print the tree for
    - prefix: Prefix for the current item (used for recursion)
    - skip_dirs: List of directory names to skip (e.g., ['.git'])
    - file: File object to write to (defaults to sys.stdout)
    """
    if skip_dirs is None:
        skip_dirs = ['.git']  # Directories to skip by default
    
    directory_path = Path(directory)
    
    # Get all entries in the directory sorted alphabetically
    entries = sorted(directory_path.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
    
    # Count total entries for formatting
    count_entries = sum(1 for e in entries if e.name not in skip_dirs)
    
    # Process each entry
    for i, entry in enumerate(entries, 1):
        if entry.name in skip_dirs:
            continue
        
        # Determine if this is the last entry in the current directory
        is_last = (i == count_entries)
        
        # Create the appropriate branch symbol
        branch = '└── ' if is_last else '├── '
        
        # Print current entry
        print(f"{prefix}{branch}{entry.name}", file=file)
        
        # If directory, recursively print its contents
        if entry.is_dir():
            # Next level prefix
            next_prefix = prefix + ('    ' if is_last else '│   ')
            print_directory_tree(entry, next_prefix, skip_dirs, file)

def main():
    """Main function to execute the script."""
    # Get directory from command line argument or use current directory
    directory = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    # Optional list of directories to skip
    skip_dirs = ['.git']
    
    # Output file
    output_file = 'directory_tree_output.txt'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        print(f"Directory tree for: {os.path.abspath(directory)}", file=f)
        print(file=f)
        print(directory, file=f)
        print_directory_tree(directory, skip_dirs=skip_dirs, file=f)
    
    print(f"Directory tree has been written to {output_file}")

if __name__ == '__main__':
    main() 