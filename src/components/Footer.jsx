import { Link } from "react-router-dom";

function Footer(props) {
    return (
        <footer className="footer">
            <Link to="//github.com/shivamdevs" target="_blank">© Shivam Devs 2022</Link>
            <div className="version">Version: 1.0.0</div>
        </footer>
    );
}
export default Footer;