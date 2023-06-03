# build image
echo "Building image..."
docker build . -t codebook
# run container
docker run -p 8080:8080 -it codebook
