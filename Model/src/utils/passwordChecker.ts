enum PasswordStrength {
    Weak = 'Weak',
    Strong = 'Strong',
  }
  
  export function checkPasswordStrength(password: String): PasswordStrength {
    const minLength = 8;
    const minUpperCase = 1;
    const minLowerCase = 1;
    const minNumbers = 1;
    const minSpecialChars = 1;

    const upperCaseRegex = /[A-Z]/g;
    const lowerCaseRegex = /[a-z]/g;
    const numberRegex = /[0-9]/g;
    const specialCharRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/g;
  

    if (password.length < minLength) {
      return PasswordStrength.Weak;
    }
  
    
    if ((password.match(upperCaseRegex) || []).length < minUpperCase) {
      return PasswordStrength.Weak;
    }
  
    
    if ((password.match(lowerCaseRegex) || []).length < minLowerCase) {
      return PasswordStrength.Weak;
    }
  

    if ((password.match(numberRegex) || []).length < minNumbers) {
      return PasswordStrength.Weak;
    }
  
    
    if ((password.match(specialCharRegex) || []).length < minSpecialChars) {
      return PasswordStrength.Weak;
    }
  
    
    return PasswordStrength.Strong;
  }
  