import { useState } from "react";
import { Loader2, Lock, ArrowRight, Mail } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleResponse } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/fields/InputField";
import { CheckboxField } from "../components/fields/CheckboxField";
import { ROUTE_PATHS } from "../config/paths";

// ─── Illustration Panel ─────────────────────────────────────
function IllustrationPanel() {
  return (
    <div
      className="w-full lg:w-1/2 order-1 lg:order-2 min-h-[30vh] lg:min-h-[100dvh] rounded-b-4xl lg:rounded-none lg:rounded-l-full bg-cover bg-center"
      style={{
        backgroundImage: `url('/Images/auth.jpg')`,
      }}
    />
  );
}

// ─── Main AuthPage ───────────────────────────────────────────
export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogging } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "", rememberMe: false },
    validationSchema,
    onSubmit: async (values) => {
      await handleResponse(dispatch(signIn(values)), () => {
        navigate(ROUTE_PATHS.HOME);
      });
    },
  });

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row">
      {/* Illustration */}
      <IllustrationPanel />

      {/* Form Section */}
      <div className="w-full lg:w-1/2 order-2 lg:order-1 flex items-center justify-center bg-white px-6 lg:px-16 py-10">
        <div className="w-full max-w-md">
          {/* Logo (Desktop only) */}
          <div className="hidden lg:flex mb-10 items-center gap-2.5">
            <img src="/Images/Logo.svg" alt="" className="w-44" />
          </div>

          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
            Sign In to your Account
          </h1>
          <p className="text-gray-400 text-sm mb-6 lg:mb-8">
            Welcome back! Please enter your details.
          </p>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 lg:space-y-5"
          >
            <InputField
              label="Email"
              name="email"
              placeholder="Enter Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
              icon={Mail}
            />

            <InputField
              label="Password"
              name="password"
              type={"password"}
              placeholder="Enter Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
              icon={Lock}
            />

            <div className="flex items-center justify-between pt-1">
              <CheckboxField
                label={"Remember me"}
                name={"rememberMe"}
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />

              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || isLogging}
              className="btn w-full bg-primary-500 text-white hover:bg-primary-600 
             disabled:opacity-50 flex items-center justify-center gap-2 
             transition-all duration-200 group"
            >
              {isLogging && <Loader2 className="w-4 h-4 animate-spin" />}

              <span>{isLogging ? "Signing In..." : "Sign In"}</span>

              {!isLogging && (
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </button>
          </form>

          <div className="mt-6 lg:mt-8">
            <p className="text-center text-sm text-gray-500">
              Copyrights © {new Date().getFullYear()} - Roller Coster
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
