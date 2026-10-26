
function Research() {
    const publicationUrl = "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4367111";

    return (
        <section className="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto text-center">
                <p className="text-purple-400 font-medium mb-3">Published Research</p>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Chaotic Image Encryption</h2>

                <p className="text-gray-300 mb-4">Presented at ICICC-2023</p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 inline-block text-left">
                    <p className="text-gray-300">Entropy: <strong>7.9982</strong></p>
                    <p className="text-gray-300">NPCR: <strong>99.61%</strong></p>
                    <p className="text-gray-300 mt-2">Reference: SSRN DOI: 4367111</p>

                    <div className="mt-4">
                        <a
                            href={publicationUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-purple-600 px-4 py-2 rounded-md"
                        >
                            View Publication
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Research;
