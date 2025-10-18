import back from "../assets/back.svg";
import SL from "../assets/stambicLogo.svg";

export default function profile() {
  return (
    <div className="div">
      <div className="div">
        <img src={back} alt="" />
      </div>
      <h1>Profile</h1>
      <div className="div">
        <img src={SL} alt="" />
        <h1>Hi! Carrington</h1>
        <p>waltercarrington@stanbicibtc.com</p>
        <button
          type="submit"
          className="h-14 w-full bg-[#D60000] font-benton-black text-[21px] leading-[150%] rounded-[12px] shadow-[5px_5px_0px_0px_#1B1D22] active:shadow-[0px_0px_0px_0px_#1B1D22] active:translate-y-[5px] active:translate-x-[5px] transform flex items-center justify-center transition-all duration-150"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
