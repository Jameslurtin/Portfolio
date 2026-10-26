import { profile } from "../data/profile";
import { safeLink } from "../lib/preferences";
import { useLanguage } from "../lib/Language";
import { useState, useRef } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { sendEmailFromForm, isContactConfigured } from "../lib/email";

function Contactform() {
  const { t } = useLanguage();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || !formRef.current.reportValidity() || formRef.current.elements.website.value.trim()) return;
        setLoading(true);
        setStatus(null);

        try {
            const result = await sendEmailFromForm(formRef.current);
            if (result && result.ok) {
                setStatus({ ok: true, message: "Message submitted — thank you for getting in touch!" });
                formRef.current.reset();
            } else {
                setStatus({ ok: false, message: result?.error || "Failed to send message. Try again later." });
            }
        } catch {
            setStatus({ ok: false, message: "Failed to send message. Try again later." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-black text-white py-16 px-6 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <p className="text-purple-400 font-medium mb-3">{t("Contact")}</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">{t("Let’s build something impactful")}</h2>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-7 max-w-lg">{t("I am seeking a six-month final-year internship in AI applications, Python full-stack development or software engineering. Available immediately in Paris with an EPITA convention de stage.")}</p>

                    <div className="mt-6 space-y-3">
                        <a href={safeLink(`mailto:${profile.email}`)} className="flex items-center gap-3 text-gray-300"> <FaEnvelope className="text-purple-400" /> <span>{t("jameslurtin@gmail.com")}</span></a>
                        <a href={safeLink(profile.github)} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300"> <FaGithub className="text-purple-400" /> <span>{t("github.com/Jameslurtin")}</span></a>
                        <a href={safeLink(profile.linkedin)} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300"> <FaLinkedin className="text-purple-400" /> <span>{t("linkedin.com/in/jameslurtin-veeraraj")}</span></a>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-lg">
                    {isContactConfigured ? <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" aria-label={t("Contact form")}>
                        <div className="hidden" aria-hidden="true">
                            <label htmlFor="website">{t("Leave this field empty")}</label>
                            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                        </div>
                        <div>
                            <label htmlFor="from_name" className="text-sm text-gray-300">{t("Name")}</label>
                            <input id="from_name" name="from_name" required autoComplete="name" maxLength={100} className="w-full mt-2 p-3 rounded-lg bg-black/60 border border-white/5" placeholder={t("Your full name")} />
                        </div>

                        <div>
                            <label htmlFor="reply_to" className="text-sm text-gray-300">{t("Email")}</label>
                            <input type="email" id="reply_to" name="reply_to" required autoComplete="email" maxLength={254} className="w-full mt-2 p-3 rounded-lg bg-black/60 border border-white/5" placeholder={t("you@domain.com")} />
                        </div>

                        <div>
                            <label htmlFor="phone" className="text-sm text-gray-300">{t("Phone (optional)")}</label>
                            <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={50} className="w-full mt-2 p-3 rounded-lg bg-black/60 border border-white/5" placeholder={t("Your phone number")} />
                        </div>
                        <div>
                            <label htmlFor="subject" className="text-sm text-gray-300">{t("Subject")}</label>
                            <input id="subject" name="subject" required maxLength={160} className="w-full mt-2 p-3 rounded-lg bg-black/60 border border-white/5" placeholder={t("Short subject")} />
                        </div>

                        <div>
                            <label htmlFor="message" className="text-sm text-gray-300">{t("Message")}</label>
                            <textarea id="message" name="message" required rows="5" maxLength={5000} className="w-full mt-2 p-3 rounded-lg bg-black/60 border border-white/5" placeholder={t("Describe your project or opportunity")}></textarea>
                        </div>

                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={loading} aria-busy={loading} className="bg-purple-600 px-5 py-3 rounded-lg font-semibold">{loading && <span className="send-spinner" aria-hidden="true" />}{t(loading ? "Sending..." : "Send Message")}</button>
                            <a href={safeLink(profile.resume)} target="_blank" rel="noreferrer" className="text-sm text-gray-300 underline">{t("Download Resume")}</a>
                        </div>

                        {status && (
                            <p role="status" className={`form-feedback ${status.ok ? "form-success" : "form-error"}`}>{t(status.message)}</p>
                        )}

                    </form> : <div className="space-y-4"><h3 className="text-xl font-semibold">{t("Get in touch")}</h3><p className="text-gray-300">{t("Email me about your team, project or internship opportunity.")}</p><a className="inline-block bg-purple-600 px-5 py-3 rounded-lg font-semibold" href={safeLink(`mailto:${profile.email}`)}>{t("Email Jameslurtin")}</a><a className="block text-purple-300 underline" href={safeLink(profile.resume)}>{t("Download Resume")}</a></div>}
                </div>
            </div>
        </section>
    );
}

export default Contactform;
