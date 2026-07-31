import superteamLogo from "../assets/2026/superteam-logo.svg";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__credit">
        <span>Powered by</span>
        <img src={superteamLogo} alt="Superteam" className="site-footer__superteam" />
      </p>
    </footer>
  );
}
