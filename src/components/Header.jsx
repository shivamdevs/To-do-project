import { Route, Routes, Link } from "react-router-dom";

function Header(props) {
    return (
        <header className="header">
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/api" element={<Call />} />
            </Routes>
        </header>
    );
}
export default Header;

function Home(props) {
    return (
        <>
            <div className="header-logo">
                <img src="/logo192.png" className="header-logo-img" alt="" />
                <h1>To do List</h1>
            </div>
            <Link to="/api" className="button">Api Call</Link>
        </>
    );
}

function Call() {
    return (
        <>
            <div className="header-logo">
                <img src="/logo192.png" className="header-logo-img" alt="" />
                <h1>To do List</h1>
            </div>
            <Link to="/" className="button">Back</Link>
        </>
    );
};