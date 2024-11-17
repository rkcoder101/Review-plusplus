function SvgLogo() {
    return (
        <svg
            width="50px"
            height="50px"
            viewBox="0 0 347 347"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => console.log("SVG clicked")}
            style={{ cursor: 'pointer' }} // This adds the pointer cursor on hover
        >
            <g id="channeli-logo" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Group">
                    <polygon id="Rectangle" fill="#009DFF" points="0 0 347 0 347 347 73.922355 347 37.1785714 309.821429 0 273.436576"></polygon>
                    <circle id="Oval" fill="#FFFFFF" cx="174" cy="127" r="53"></circle>
                    <rect id="Rectangle" fill="#FFFFFF" x="126" y="239" width="96" height="108"></rect>
                    <polygon id="Rectangle" fill="#007AE5" points="0 273 74 273 74 347 37 310"></polygon>
                </g>
            </g>
        </svg>
    );
}

export default SvgLogo;
