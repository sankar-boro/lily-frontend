const BodyComponent = (props: any) => {
    return (
        <>
            <div className="navbar-left">{props.leftComponent}</div>
            <div className="body-container">
                <div className="toolbar">
                    <div className="document-categories">
                        <div className="document-section">Novels</div>
                        <div className="document-section">Science</div>
                        <div className="document-section">Maths</div>
                        <div className="document-section">History</div>
                    </div>
                    <div className="settings"></div>
                </div>
                <div>{props.children}</div>
            </div>
        </>
    );
};

export default BodyComponent;
