<script>
   import { ref } from "vue";
   import {
      getStorage,
      ref as storageRef,
      uploadBytes,
      getDownloadURL,
   } from "firebase/storage";
   import { getAuth, updateProfile } from "firebase/auth";

   export default {
      name: "ProfilePhotoUpload",
      data() {
         return {
            file: null,
         };
      },
      methods: {
         onFileChange(event) {
            this.file = event.target.files[0];
         },
         async uploadProfilePicture() {
            if (!this.file) return;

            const storage = getStorage();
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const fileRef = storageRef(storage, `profilePictures/${user.uid}`);
            await uploadBytes(fileRef, this.file);
            const photoURL = await getDownloadURL(fileRef);

            // Update user profile
            await updateProfile(user, { photoURL });

            // Update Firestore user document
            const db = getFirestore();
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { photoURL }, { merge: true });

            alert("Profile picture updated successfully!");
         },
      },
   };
</script>

<template>
   <div>
      <input type="file" @change="onFileChange" />
      <button @click="uploadProfilePicture">Upload</button>
   </div>
</template>
