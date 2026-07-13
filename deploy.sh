#!/usr/bin/env bash

set -e

git pull

FULL_BUILD=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -f|--full)
            FULL_BUILD=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [-f|--full]"
            exit 1
            ;;
    esac
done

# Perform full build if requested
if $FULL_BUILD; then
    docker compose build base
fi

# Restart containers
docker compose down
docker compose up -d