/* eslint-disable react-hooks/exhaustive-deps */

import axios from 'axios';
// import locale from '../constant/locale';

const api =
  process.env.REACT_APP_ENV === 'development' ? 'http://localhost:4000/v1/' : 'https://dev.certyiq.com/v1/';
class API {
  /**
   * Signin using metamask
   * @param {string} walletAddress
   * @param {string} signature
   */
  static setToken(accessToken) {
    axios.defaults.headers.common.Authorization = accessToken;
  }

  static setCountry(country) {
    axios.defaults.headers.common.country = country || "IN";
  }

  static setDeviceUUID(uuid) {
    axios.defaults.headers.common.accountuuid = uuid;
    if (uuid)
      localStorage.setItem("c_uuid", uuid)
  }

  /**
   * A helper function used to handle request
   * @param {string} api
   * @param {object} params
   * @param {object} config
   */
  static handleRequest(method = 'post', url, params = {}, config = {}) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('accessToken');
      if (token) axios.defaults.headers.common.Authorization = token;
      axios[method](url, params, config)
        .then((response) => resolve(response.data))
        .catch((error) => {
          if (error?.response?.status === 401 || error?.response?.status === 400) {
            localStorage.removeItem('accessToken');
          }
          reject(error?.response?.data);
        });
    });
  }

  /**
   * To get OTP
   * @param {string} address
   */
  static getOTP(address) {
    try {
      let url = api + `auth/${address}`;
      return this.handleRequest('get', url, {});
    } catch (error) {
      return error;
    }
  }

  /**
   * To confirm OTP
   * @param {string} address
   * @param {number} otp
   */
  static confirmOTP(address, otp, referral) {
    try {
      const params = {
        id: address,
        otp,
        referral
      };
      let url = api + `auth/confirm-auth`;
      const result = this.handleRequest('post', url, params);
      return result;
    } catch (error) {
      return error;
    }
  }

  /**
 * 
 * @param {string} access_token
 */
  static googleLogin(access_token, referral, type) {
    try {
      const params = {
        access_token,
        referral,
        type
      };
      let url = api + `auth/google-login`;
      const result = this.handleRequest('post', url, params);
      return result;
    } catch (error) {
      return error;
    }
  }

  /**
   * Get User detail
   */
  static getUserDetails(token) {
    try {
      axios.defaults.headers.common.Authorization = token;
      let url = api + `auth`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  }


  /**
   * Get User detail
   */
  static getUserCountryDetails() {
    try {
      // let url = api + `public/get-country`
      let api = getRandomElementIP()
      let url = `https://api.ipregistry.co/?key=${api}`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  }

  /**
 * Get User detail
 */
  static getFiatCurrency() {
    try {
      let url = api + `public/fiat-price`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  }

  /**
   * File
   */
  static uploadImage = async (file) => {
    try {
      if (!file) return '';
      let url = api + `user/uploadImage`;
      let object = {
        image: file
      };
      return this.handleRequest('post', url, object);
    } catch (error) {
      return error;
    }
  };
  /**
   * Update user profile
   */
  static updateProfile = async (params) => {
    try {
      let url = api + `user/update`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /**
   * Product create
   */

  static createProduct = async (params) => {
    try {
      let url = api + `product/create`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };
  /**
   * Get user product list create
   */

  static getUserProducts = async (params) => {
    try {
      let url = api + `product/getUserProducts`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
   * Get product
   */
  static getProduct = async (params) => {
    try {
      let url = api + `product/${params}`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };

  /*
 * Get product
 */
  static getUserProductBuyDetails = async (params) => {
    try {
      let url = api + `user/user-paper-details`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
   * Update product
   */
  static updateProduct = async (params) => {
    try {
      let url = api + `product/update`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
   * delete product
   */
  static deleteProducts = async (params) => {
    try {
      let url = api + `product/delete`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
   * delete product
   */
  static getProducts = async (params) => {
    try {
      let url = api + `product/getProducts`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
 * download product
 */
  static downloadProduct = async (params) => {
    try {
      let url = api + `product/download`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
 * get razorpay PaymentId
 */
  static getPaymentId = async (params) => {
    try {
      let url = api + `user/getPaymentId`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
* get razorpay capture id
*/
  static capturePayment = async (params) => {
    try {
      let url = api + `user/payment-capture`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
* get paypal capture id
*/
  static paypalPaymentCapture = async (params) => {
    try {
      let url = api + `user/paypal-payment-capture`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };
  /*
* download product
*/
  static buyProduct = async (params, country) => {
    try {
      let url = api + `product/buy`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };
  /*
   * delete product
   */
  static status = async (params) => {
    try {
      let url = api + `status`;
      return this.handleRequest('get', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
* get User Transaction History
*/
  static getUserTransactionHistory = async () => {
    try {
      let url = api + `user/get-transaction-history`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };

  /*
* paper redownload 
*/
  static reDownload = async (params) => {
    try {
      let url = api + `user/re-download`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
* paper redownload 
*/
  static subscribe = async (email) => {
    try {
      let url = api + `public/subscribe/${email}`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };

  /*
* paper redownload 
*/
  static sendMessage = async (params) => {
    try {
      let url = api + `public/create-message`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };


  /*
 * user admin txn list
 */
  static getAdminTransactions = async (params) => {
    try {
      let url = api + `admin/getOrders`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
 * post api for examm paper modals
 */
  static postExamPaperModal = async (params) => {
    try {
      let url = api + `product/postExamPaperModal`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
* post api for examm paper modals
*/
  static postExamPapers = async (params) => {
    try {
      let url = api + `product/postExamPapers`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static examSubscriptionStatus = async (params) => {
    try {
      let url = api + `user/exam-subscription-status`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static updatePaperDetails = async (params) => {
    try {
      let url = api + `admin/update-paper-status`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static updatePaperPDFs = async (params) => {
    try {
      let url = api + `admin/update-paper-pdf`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static getPaperPDFs = async (params) => {
    try {
      let url = api + `admin/get-pdf`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static getStreams = async (params) => {
    try {
      let url = api + `product/getStreams`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static getDownloadLink = async (params) => {
    try {
      let url = api + `product/getDownloadLink`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };
  static checkCoupon = async (params) => {
    try {
      let url = api + `product/couponVerify`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
* post api for examm paper modals
*/
  static postPracticeTest = async (params) => {
    try {
      let url = api + `product/get-practice-paper`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
* post api for examm paper modals
*/
  static postBuyOffline = async (params) => {
    try {
      let url = api + `user/buy-offline`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  /*
* post api for examm paper modals
*/
  static deleteAccount = async (params) => {
    try {
      let url = api + `user/delete`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static getAdminUserAccessDetails = async (params) => {
    try {
      let url = api + `admin/get-user-subscription-details`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static postAdminProvideUserAccess = async (params) => {
    try {
      let url = api + `admin/add-user-premium-access`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static adminPaperDashboard = async (params) => {
    try {
      let url = api + `admin/get-dashboard-chart`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static adminUsersOverviewDashboard = async (params) => {
    try {
      let url = api + `admin/get-users-overview`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static adminUpdateAccessStatus = async (params) => {
    try {
      let url = api + `admin/update-access-status`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static getUserReferralCode = async (params) => {
    try {
      let url = api + `referral/get-referral-code`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };

  static getReferralOverview = async (params) => {
    try {
      let url = api + `referral/get-referral-overview`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };

  static getReferralList = async (params) => {
    try {
      let url = api + `referral/get-referral-list`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };

  static getRewardsList = async (params) => {
    try {
      let url = api + `referral/my-rewards-list`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };


  // vouchers
  static verifyVoucher = async (params) => {
    try {
      let url = api + `voucher/verify-voucher`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static createVoucher = async (params) => {
    try {
      let url = api + `voucher/create`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static getAdminVouchersList = async (params) => {
    try {
      let url = api + `voucher/get-vouchers`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static deleteVoucher = async (params) => {
    try {
      let url = api + `voucher/delete-vouchers`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };

  static getDeviceToken = async () => {
    try {
      let url = api + `auth/get-device-token`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };

  static checkInitialVoucher = async () => {
    try {
      let url = api + `voucher/check-initial-vouchers`;
      return this.handleRequest('get', url);
    } catch (error) {
      return error;
    }
  };

  static checkoutAnalytic = async (params) => {
    try {
      let url = api + `analytic/initiated-checkout`;
      return this.handleRequest('post', url, params);
    } catch (error) {
      return error;
    }
  };
}

export default API;

const getRandomElementIP = () => {
  let array = ["aohgeasdxbbug6y6", "4c3emd3c9subw4cv", "3x7uce5ctxgd1nqp", "399efce3v5qhfkn0", "hso1bjresl2rtxg3"]
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}