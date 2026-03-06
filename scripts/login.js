const signInBtn = elementTaker("sign-in-btn");
const userName = elementTaker("user-name-input");
const userPass = elementTaker("user-login-pass");

const loginMachine = () => {
  const userNameValue = userName.value;
  const userPasswordValue = userPass.value;

  if (userNameValue !== "admin" || userPasswordValue !== "admin123") {
    alert("Wrong Input");
    userPass.value = "";
  } else {
    window.location.replace("home.html");
  }
};
signInBtn.addEventListener("click", loginMachine);
userPass.addEventListener("keydown", (e) => {
  const targetKey = e.key;

  if (targetKey === "Enter") {
    loginMachine();
  }
});
