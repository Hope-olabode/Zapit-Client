import { useForm } from "react-hook-form";

import api from "../api/axios";
import { useState } from "react";
import ButtonLoader from "../components/ButtonLoader";
import mail from "../assets/mail.svg";
import key from "../assets/key.svg";
import logo from "../assets/logo.svg";
import view1 from "../assets/view1.svg";
import view2 from "../assets/view2.svg";
import { Toaster, toast } from "sonner";

export default function Home() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(false);
  const [green1, setGreen1] = useState(false);
  const [green2, setGreen2] = useState(false);

  // 🔑 Handle Login
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", data); // withCredentials is already set in api.js
      toast.success("Login successful!");
      console.log(response.data);
      window.location.href = "/logs";
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🚨 Show validation errors via toast instead of inline <p> tags
  const onError = (formErrors) => {
    Object.values(formErrors).forEach((err) => {
      toast.error(err.message);
    });
  };

  return (
    <div className="h-[100dvh] bg-gray-100">
      <Toaster position="top-center" richColors />

      <div className="text-center relative h-[47%] flex flex-col justify-center bg-[length:23px_23px] bg-[repeating-linear-gradient(0deg,#FFFFFF70_0_1px,transparent_1px_23px),repeating-linear-gradient(90deg,#FFFFFF70_0_1px,transparent_1px_23px)]">
        <img
          className="mx-auto absolute top-[-188px] left-[50%] translate-x-[-50%] pt-20"
          src={logo}
          alt="logo"
        />
        <h1 className="text-[48px] font-benton-black mb-4 leading-[125%] text-[#1B1D22] tracking-[-1.5px]">
          Welcome back!
        </h1>
        <p className="font-benton-regular text-[15px] leading-[150%] text-[#292C33]">
          Enter email and password.
        </p>
      </div>

      <div className="h-[53%] flex flex-col items-center overflow-hidden relative">
        <div className="div h-full border-t-2 border-x-2 w-[100.5%] rounded-t-2xl overflow-hidden absolute left-[50%] translate-x-[-50%] bg-[#F6F7F9]">
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="h-full bg-[#F6F7F9] flex flex-col gap-4 p-6 w-full lg:w-[600px] lg:px-0 justify-between absolute left-[50%] translate-x-[-50%]"
          >
            <div className="flex flex-col gap-6">
              <div className={`flex items-center gap-2 h-12 border-b-2  ${green1 ? "border-b-[#4ECDC4]":"border-b-[#E8E9EB]"}`}>
                <img src={mail} alt="" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    onChange: () => setGreen1(true),
                  })}
                  className="border-0 focus:outline-none w-full text-[#989898]"
                  type="email"
                  placeholder="Email"
                />
              </div>

              <div className={`flex items-center gap-2 h-12 border-b-2 ${green2 ? "border-b-[#4ECDC4]":"border-b-[#E8E9EB]"}`}>
                <img src={key} alt="" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    onChange: () => setGreen2(true),
                  })}
                  className="border-0 focus:outline-none w-full text-[#989898]"
                  type={view ? "text" : "password"}
                  placeholder="Password"
                />
                <img
                  onClick={() => setView((prev) => !prev)}
                  src={view ? view2 : view1}
                  alt=""
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`h-14 ${
                loading
                  ? "bg-[#E1E2E5] shadow-[5px_5px_0px_0px_#CED0D5]"
                  : "bg-[#4ECDC4] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px]"
              }  font-benton-black text-[21px] leading-[150%] rounded-[12px] transform flex items-center justify-center transition-all duration-150`}
            >
              {loading ? <ButtonLoader /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
