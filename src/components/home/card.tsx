const Card = (props: { history: any; data: any }) => {
    const { history, data } = props;
    return (
        <div
            className="card"
            key={data.bookId}
            onClick={() => {
                history.push({
                    pathname: `/book/view/${data.bookId}`,
                    state: data,
                });
            }}
        >
            <div>
                <div className="card-title hover"><span>{data.title}</span></div>
                <div className="card-body hover">
                    {data.body.substr(0, 250)}...
                </div>
            </div>
        </div>
    );
};

export default Card;
