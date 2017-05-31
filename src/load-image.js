import axios from 'axios'

const LoadImageFromUrl = (url, callback) => {
    const image = new Image();
    image.onload = () => {
        callback(image);
    }
    image.src = url;
    // axios.get(url)
    // .then((response) => {
    //     const image = new Image();
    //     image.onload = () => {

    //     }
    //     image.src = 
    //     console.log(response.data);
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
}

export default LoadImageFromUrl;