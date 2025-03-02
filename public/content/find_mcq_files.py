import os
from collections import defaultdict
import re
from datetime import datetime

def find_mcq_files():
    # Dictionary to store files by their MCQ number
    mcq_files = defaultdict(list)
    
    # Walk through all directories
    for root, dirs, files in os.walk('.'):
        for file in files:
            # Check if it's a PNG file and contains MCQ
            if file.lower().endswith('.png') and ('mcq' in file.lower()):
                # Get the full path
                full_path = os.path.join(root, file)
                # Try to extract MCQ number
                match = re.search(r'mcq\s*(\d+)', file.lower())
                if match:
                    mcq_num = int(match.group(1))
                    mcq_files[mcq_num].append(full_path)
                else:
                    # If no number found, store under 0
                    mcq_files[0].append(full_path)

    return mcq_files

def print_mcq_summary(mcq_files, output_file=None):
    def write_line(line):
        print(line)
        if output_file:
            output_file.write(line + '\n')

    write_line("\nMCQ Files Summary:")
    write_line("=" * 80)
    
    # Print files with valid MCQ numbers
    for mcq_num in sorted(mcq_files.keys()):
        if mcq_num > 0:  # Skip the ones without numbers
            write_line(f"\nMCQ #{mcq_num}:")
            for path in sorted(mcq_files[mcq_num]):
                write_line(f"  - {path}")

    # Print files without clear MCQ numbers if any exist
    if 0 in mcq_files:
        write_line("\nMCQ files without clear numbers:")
        for path in sorted(mcq_files[0]):
            write_line(f"  - {path}")

    # Print total counts
    total_unique_mcqs = len(mcq_files) - (1 if 0 in mcq_files else 0)
    total_files = sum(len(paths) for paths in mcq_files.values())
    
    write_line("\nSummary Statistics:")
    write_line("=" * 80)
    write_line(f"Total unique MCQ numbers found: {total_unique_mcqs}")
    write_line(f"Total MCQ files found: {total_files}")
    if total_unique_mcqs < 40:
        write_line(f"Warning: Found {total_unique_mcqs}/40 expected MCQ questions")

if __name__ == "__main__":
    # Create output filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"mcq_locations_{timestamp}.txt"
    
    mcq_files = find_mcq_files()
    
    # Write to both stdout and file
    with open(output_filename, 'w') as output_file:
        # Write header with timestamp
        output_file.write(f"MCQ File Locations Report - Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        print_mcq_summary(mcq_files, output_file)
    
    print(f"\nReport has been saved to: {output_filename}") 