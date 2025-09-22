import axios from '../../utils/axios-custome';



// ************ GET - POST - PUT - PATCH - DELETE **************


// 1. POST Login by Google account
export const loginGoogle = (credential) => {
  return axios.post('/auth/google-login', {
    id_token: credential
  }, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}


// 2. POST Login by Normal account
export const loginEmail = (email, password) => {
  return axios.post('/auth/login', {
    email: email,
    password: password
  }, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}


// 3. POST Send OTP to Personal Email
export const sendOTPEmail = (email) => {
  return axios.post('/otp/email/generate', {
    email: email,
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  })
}



// 4. POST Verify Email by OTP
export const verifyEmail = (email, otp) => {
  return axios.post('/otp/email/verify', {
    email: email,
    otp_code: otp,
  },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}


// 5. POST Signup an Normal account
export const signupEmail = (email, fullname, password) => {
  return axios.post('/users', {
    email: email,
    full_name: fullname,
    password: password
  },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}


// 6. POST Check if Email is existed
export const checkEmail = (email) => {
  return axios.post(`/check-email`,{
    email: email
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


// 7. POST Verify Token by JWT
export const verifyToken = (access_token) => {
  return axios.post('tokens/verify', {
    access_token: access_token
  })
}


// 8. POST Verify OPT by Phone Number
export const verifyOtp = (id, phone, otp) => {
    return axios.post('/otp/phone-number/verify', {
        user_id: id,
        phone_number: phone,
        otp_code: otp
    }
    );
}


// 9. POST Send OTP to Phone Number
export const verifyPhone = (phone) => {
    return axios.post('/otp/phone-number/generate', {
        phone_number: phone
    })
}

