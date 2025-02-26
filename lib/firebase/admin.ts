import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Your service account credentials
const serviceAccount = {
  type: "service_account",
  project_id: "sahiurl",
  private_key_id: "95c0b55115b9c29e5a26d0e5dc34f982ffc06ac7",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvR3uzBnhbZyyN\nwvABMl0WUMTAXcMYm3mbKLKUsCuSvUJTtafQp/cAXJyWJmJxX8a5lLet8AqN0NLl\nbI6mlBnN0tdL3ZROGmvcP1lUI2zPP1KA1y0dL+I9pyv6edYcTXxZFGLNnxVK9H+y\nPv2qNAc4vFHigJHqv8HEBoENlwibWE7PeBkphj7vUaMvW1FaOVssgF0S5p3Ia1cv\nKI23J+bExnkU2uyLNBb8l7ZzQmDRd1mEL1hyKqUr2V7MWE6MTAAFVdGjvJ9aQPuf\nmMoiILlSvx4FXCpm3vUgPz2uPfd45xDkmpsHUtN9kYTzvNCtQtNxfQ6TGKm3yiw/\naDV0hec5AgMBAAECggEAJC+j0A/z5RrlzdaC6hxVr3e5RuWUk431ixzZ0WyVclP0\nT4ffP2qNydtU0ILYLAPT6RhU22oFI8YK5CaHRMiqkx2GKTlzlrRJtEy3ynEN07OE\n+uhxfecW1BehMrLYiztMAq/8veqr4K+ddVUf1XWsUABA/3v/o/E2tZuKJR4bPsai\n9ED+Dmm7e3quXx8H3lvkc8JZcHWBmejihW1iCBiey/2Sz1Uk1qPUKMuAm01gjT+I\nVm+xY+AAg/FvmiHc85mX2PlQlpZ5LpCCU0Dwnlnnqtse02FpiSertSLL9GQoQT/5\nQPX+1L6uBF5TS5UUdekEZAWQOc5U0CugFY9Y5JJ7yQKBgQDXi6Z/b5woHp99JGfm\ncsC4+rbG/q4iILiEEvzsrVIkKxfvN6czJszCEGmWN8pAJNfLmIQuAUamlEXXzqCz\nnRb9hbRhbGsF1gWIocL8KZ+xBF4JIN8o8R3UzIG0YvzbNDG9cTFyd7k20IwgbC2u\nsvMAHfFdCzN7dwsw4b0RExc5twKBgQDQLScKnqJrLfkRKGcx41naUg0mKlcYjvDW\n2bjTwZ7VsupQQGyY4+FRlKiOOSlEnLpkXu8rvFvVCvT6h8Y6wCjMG+7oqyHsXtmv\n2H/K4Y/duD7qnR0175UP43RA/luMtSt/GkUF/1GCR7/1lDqhj8wERiaJnqCs3LjF\nYYoFneCmjwKBgQCmLPY6PXPowmM3eb/YvRO0CSatGGBr00ouGO2CEsXHOKoFNaTk\nHL+zxi+BLpXxCfaM8pLFXRp5Bssp7BWdJDk7T7+XdJy2LSCrC/tlqTmCodlVtFAY\nInxbOSeuSLqkzQKkCQaUN5VFm1bNEFnP3ArYRj10/FO+ljK8huzaoxs+1QKBgQCy\nBAqAsEqfcH6tx2kHZizt3oBUBJzZ6VHVx/SfT9DtWMO5wH2c+DEzO/YvOH4rqAJT\n1kKbmcTFl0sJ+ZTvpGa+s5xG5iBqKmnoTzBoYx5NMULMCXJzLt6+6Xf+JARRfJMn\na2VezYf76jMiY5EHmxmRBhPqVvV7HHv8fX4zc2ApzQKBgH21V3xPRaS6deI7JHdS\nInudRBeCnis9fGK1NnEZfJNoDkN6tjgTEt0bUtiKYfkTOOzB/41hXlhQwdeNL4AL\n+IkHXyHTL9iuGu+xGyY4m+wvtGZob55D6XitGfpv5bhOzJ9VmI952kMa6eE5u5wG\nduunOjIvK1ujDQr2QKtuE4l/\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@sahiurl.iam.gserviceaccount.com",
  client_id: "113823996769528201073",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sahiurl.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

// Initialize Firebase Admin if it hasn't been initialized already
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

export const auth = getAuth()
export const db = getFirestore()

