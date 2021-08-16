import Card from "./Card";
import HomeServiceProvider, { useHomeContext } from "../../service/HomeServiceProvider";

const Main = () => {
    const { books } = useHomeContext();
    return (
        <div className="container-sm">
            {books
                .filter((a: any) => a.identity === 101)
                .map((data: any) => {
                    return <Card data={data} key={data.uniqueId} />;
                })}
        </div>
    );

}

const Home = () => {
    return <HomeServiceProvider>
        <Main />
    </HomeServiceProvider>
};

export default Home;
