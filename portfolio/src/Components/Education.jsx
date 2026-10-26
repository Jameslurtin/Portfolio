import { useLanguage } from "../lib/Language";
export default function Education() {
  const { t } = useLanguage();
  return (
    <section className="bg-black text-white py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-purple-400 font-medium mb-3">{t("Education")}</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t("Software engineering foundations")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <article className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold">{t("MSc Software Engineering")}</h3>
            <p className="text-purple-300 mt-2">{t("EPITA · Paris, France · 2024–Present")}</p>
            <p className="text-gray-300 mt-4 leading-7">{t("Final-year studies in software engineering, full-stack development, APIs, databases, cloud/DevOps and application architecture.")}</p>
          </article>
          <article className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold">{t("B.E. Computer Science Engineering")}</h3>
            <p className="text-purple-300 mt-2">{t("SRM Easwari Engineering College · Chennai, India")}</p>
            <p className="text-gray-300 mt-4 leading-7">{t("Undergraduate degree in computer science and engineering, forming the foundation for my MSc studies at EPITA and my focus on building practical software applications.")}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
