import { useLanguage } from "../lib/Language";
export default function Experience() {
  const { t } = useLanguage();
  return (
    <section className="bg-black text-white py-16 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-purple-400 font-medium mb-3">{t("Experience")}</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t("React.js Developer / Software Engineer Trainee")}</h2>
        <article className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-purple-300 text-lg">{t("Altos Technology · Kochi, India · 6 months")}</p>
          <ul className="mt-5 space-y-3 text-gray-300 leading-7 list-disc pl-5">
            <li>{t("Built reusable React components and integrated frontend features with REST APIs using Axios.")}</li>
            <li>{t("Contributed to debugging and API testing with Postman.")}</li>
            <li>{t("Worked with Git/GitHub workflows, code reviews and technical documentation in an Agile environment.")}</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
