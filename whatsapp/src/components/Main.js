import Chat from './Chat'
import { useParams } from "react-router-dom";

function Main({ socket }) {
    const { chatId } = useParams();
    return (
        <main className="main">
            <div className="container h-100">
                {chatId ? <Chat socket={socket} chatId={chatId} /> : (
                    <div className="d-flex flex-column h-100 justify-content-center text-center">
                        <div className="mb-6">
                            <span className="icon icon-xl text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </span>
                        </div>

                        <p className="text-muted">Pick a person from left menu, <br /> and start your conversation.</p>
                    </div>
                )}
                {/* <Chat socket={socket}/> */}
            </div>
        </main>
    );
}

export default Main;