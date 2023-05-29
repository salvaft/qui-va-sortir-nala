#!/bin/bash

FILES=$(fd --glob 'apple*.png')
NEW=$(cut -d. -f1 <<<  $FILES | sed -E 's/(piedra)([0-9]+)/apple-touch-icon-\2-\2.png/g' | xargs)

# FILES=$(xargs <<< $FILES)
# read -ra arrayFILES <<< "$FILES"

IDX=0
echo $FILES
mapfile -t arrayFILES <<< "$FILES"
read -ra arrayNEW <<< "$NEW"
for element in "${arrayFILES[@]}"; do
  # mv "$element" "${arrayNEW[IDX]}"
  echo "$element"
  ((IDX++))
done
