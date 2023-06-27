echo "Seeing if already installed"
current_dir=$(pwd)
expected_line="export PATH=\$PATH:$current_dir"
if grep -q ~/.zshrc -e expected_line; then
  echo "found $expected_line"
  echo "No need to do anything"
else
  echo "Not found, adding..."
  echo $expected_line >> ~/.zshrc
fi
echo "Done!"
