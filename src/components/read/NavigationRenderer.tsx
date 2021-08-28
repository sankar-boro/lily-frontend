import { activeChBg, activeScBg } from "./util";
import { useBookContext} from "../../service/BookServiceProvider";


const ReadBookNavigation = (props: any) => {
    const context = useBookContext();
    const { service, activeId, sectionId } = context;
    const { data } = service;
    console.log('data', data);
    const doSome = (data: any) => {
        let child = [];
        if (data && data.child && Array.isArray(data.child)) {
            child = data.child;
        }

        return {
            chapter: data,
            sections: child,
        };
    };
    return (
        <div className="con-20 scroll-view" style={{ backgroundColor: "#ceffc9", padding: "0px 10px" }}>
            <div style={{height: 35}}/>
            {data.map((value: any, index: number) => {
                const { chapter, sections } = doSome(value);
                return (
                    <div key={chapter.title}>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                context.dispatch({
                                    type: 'ID_SETTER',
                                    payload: chapter.uniqueId,
                                    idType: 'ACTIVE',
                                });
                                context.dispatch({
                                    type: 'ID_SETTER',
                                    payload: null,
                                    idType: 'SECTION',
                                });
                            }}
                            className={`chapter-nav hover ${activeChBg(
                                chapter,
                                activeId
                            )}`}
                        >
                            {chapter.title}
                        </div>
                        <div>
                            {sections.map((c: any) => {
                                return (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            context.dispatch({
                                                type: 'ID_SETTER',
                                                payload: chapter.uniqueId,
                                                idType: 'ACTIVE',
                                            });
                                            context.dispatch({
                                                type: 'ID_SETTER',
                                                payload: c.uniqueId,
                                                idType: 'SECTION',
                                            });
                                        }}
                                        key={c.uniqueId}
                                        className="section-nav hover"
                                    >
                                        {c.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReadBookNavigation;
