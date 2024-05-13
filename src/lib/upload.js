import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const upload = async (file) => {
  const storage = getStorage();
  const storageRef = ref(storage, 'images/rivers.jpg');
  const date = new Date();


  const uploadTask = uploadBytesResumable(storageRef, `images/${date + file.name}`);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

      }, 
      (error) => {
        reject("error: " + error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          resolve(downloadURL);
        });
      }
    );
  });
}

export default upload;

