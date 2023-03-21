declare -A CACHE
for var in "$@"
do
  while read -r secret; do
    # Check if we have this secret cached
    if [ ! -v "CACHE[$secret]" ]; then
      # Fetch it from google cloud
      value=$(gcloud secrets versions access latest --secret=$secret)
      # Escape slash
      value=${value//\//\\/}
      # Escape ampersand
      value=${value//&/\\&}

      # Store to cache
      CACHE[$secret]=$value;
    fi

    # Load value from cache
    value=${CACHE[$secret]}
    # Check if it was successfully loaded
    if [ -z "$value" ]; then
      # It wasn't, send message to stdout & skip replacing it
      echo "Could not resolve secret $secret, skipping";
      continue;
    fi
    # Replace secret with it's value in file
    sed -i "s/{secret:$secret}/${value}/" $var

  # Get all {secret:SOMETHING} strings from input file
  done < <(sed -n 's/^\s*\w*: {secret:\([^}]\+\)}/\1/p' $var)
done
