#!/bin/bash
# Check script for Chrome extension files

echo "=========================================="
echo "Chrome Extension File Checker"
echo "=========================================="
echo ""

check_file() {
    if [ -f "$1" ]; then
        echo "✓ $1"
    else
        echo "✗ $1 MISSING"
        exit 1
    fi
}

echo "Required Extension Files:"
echo "------------------------"
check_file "manifest.json"
check_file "popup.html"
check_file "styles.css"
check_file "timer.js"
echo ""

echo "Icon Files:"
echo "----------"
check_file "images/icon-16.png"
check_file "images/icon-32.png"
check_file "images/icon-48.png"
check_file "images/icon-128.png"
echo ""

echo "Documentation Files:"
echo "-------------------"
check_file "README.md"
check_file "INSTALL.md"
check_file "TRANSFORMATION.md"
echo ""

echo "Validation Checks:"
echo "-----------------"
echo -n "Checking manifest.json... "
if python3 -m json.tool manifest.json > /dev/null 2>&1; then
    echo "✓ Valid JSON"
else
    echo "✗ Invalid JSON"
    exit 1
fi

echo -n "Checking JavaScript... "
if node -c timer.js > /dev/null 2>&1; then
    echo "✓ Valid syntax"
else
    echo "✗ Syntax error"
    exit 1
fi

echo -n "Checking HTML... "
if grep -qi "<html" popup.html; then
    echo "✓ Valid HTML"
else
    echo "✗ Invalid HTML"
    exit 1
fi

echo -n "Checking external dependencies... "
if grep -qr "http://\|https://" *.html *.js *.css > /dev/null 2>&1; then
    echo "✗ Found external dependencies"
    exit 1
else
    echo "✓ No external dependencies"
fi

echo ""
echo "=========================================="
echo "All checks passed!"
echo "=========================================="
echo ""
echo "Extension is ready for installation:"
echo "1. Open Chrome → chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select this folder"
echo "=========================================="
