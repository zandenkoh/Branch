document.addEventListener("DOMContentLoaded", function () {
    const loginModal = document.getElementById('login-modal');
    const createAccountModal = document.getElementById('create-account-modal');
    
    // Show Login Modal
    document.getElementById('login').addEventListener('click', function () {
        loginModal.classList.remove('hidden');
    });

    // Show Create Account Modal
    document.getElementById('create-account').addEventListener('click', function () {
        createAccountModal.classList.remove('hidden');
    });

    // Close Login Modal
    document.getElementById('close-login').addEventListener('click', function () {
        loginModal.classList.add('hidden');
    });

    // Close Create Account Modal
    document.getElementById('close-create-account').addEventListener('click', function () {
        createAccountModal.classList.add('hidden');
    });

    // Login Functionality
    document.getElementById('login-submit').addEventListener('click', function () {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Implement Firebase login logic here
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log("Logged in");
                window.location.href = "index.html"; // Redirect to index.html
            })
            .catch(error => {
                console.error("Error logging in:", error);
                alert(error.message);
            });
    });

    // Create Account Steps
    document.getElementById('next-to-verify').addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const dob = document.getElementById('dob').value;

        // Save data to local storage
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('dob', dob);

        // Create user in Firebase Auth
        auth.createUserWithEmailAndPassword(email, "tempPassword") // Use a temp password
            .then((userCredential) => {
                const user = userCredential.user;

                // Send email verification
                user.sendEmailVerification().then(() => {
                    console.log("Verification email sent");
                    alert("Verification email sent! Please check your inbox.");
                    
                    // Hide first step and show second step
                    document.getElementById('step-1').classList.add('hidden');
                    document.getElementById('step-2').classList.remove('hidden');
                });
            })
            .catch(error => {
                console.error("Error creating user:", error);
                alert(error.message);
            });
    });

    // Next button to username setup after email verification
    document.getElementById('next-to-password').addEventListener('click', function () {
        const email = localStorage.getItem('email');

        // Confirm if the user has verified their email
        auth.signInWithEmailAndPassword(email, "tempPassword")
            .then((userCredential) => {
                const user = userCredential.user;

                if (user.emailVerified) {
                    // Show username setup step
                    document.getElementById('step-2').classList.add('hidden');
                    document.getElementById('step-username').classList.remove('hidden');
                } else {
                    alert("Please verify your email before proceeding.");
                }
            })
            .catch(error => {
                alert("Error confirming email: " + error.message);
            });
    });

    // Check Username Uniqueness and Show Password Step
    document.getElementById('next-to-password-check-username').addEventListener('click', function () {
        const username = document.getElementById('username').value;

        // Check if username is unique
        db.collection("users").doc(username).get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    alert("Username already taken. Please choose another.");
                } else {
                    // Save username to local storage and proceed
                    localStorage.setItem('username', username);
                    document.getElementById('step-username').classList.add('hidden');
                    document.getElementById('step-3').classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error("Error checking username:", error);
                alert("Error checking username. Please try again.");
            });
    });

    // Create Account Button (Final Step)
    document.getElementById('create-account-submit').addEventListener('click', function () {
        const password = document.getElementById('password').value;
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');
        const dob = localStorage.getItem('dob');
        const username = localStorage.getItem('username');

        // Update the password for the created account
        auth.signInWithEmailAndPassword(email, "tempPassword") // Use the temp password to log in
            .then((userCredential) => {
                const user = userCredential.user;
                return user.updatePassword(password) // Update to the real password
                    .then(() => {
                        // Save user data to Firestore under the username as the document ID
                        return db.collection("users").doc(username).set({
                            uid: user.uid,  // Store the user's UID
                            name: name,
                            email: email,
                            dob: dob,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    })
                    .then(() => {
                        console.log("Account created and saved to Firestore successfully");
                        // Sign the user in again with the real password
                        return auth.signInWithEmailAndPassword(email, password);
                    })
                    .then(() => {
                        // Clear local storage and redirect to setup page
                        localStorage.clear();
                        window.location.href = "https://zandenkoh.github.io/Branch/Setup/"; // Redirect to setup.html
                    });
            })
            .catch(error => {
                console.error("Error creating account:", error);
                alert(error.message);
            });
    });
});
