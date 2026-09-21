import {MdEmail} from "react-icons/md";
import {FaGithub} from "react-icons/fa";

const linkButtonStyles = `p-2 rounded-md border-2 border-transparent hover:border-white/20`

export function Footer() {
    return (
        <footer className={`w-full bg-black px-8 py-2 flex items-center gap-2`}>
            <span className={`font-light text-xs mr-auto`}>
                made by <a href={"https://odis.fm"} className={`font-bold hover:underline`}>odis</a>
            </span>
            <div className={`flex items-center gap-0`}>
                <a
                    href={`mailto:itsyaboiodis@hotmail.com`}
                    className={linkButtonStyles}
                >
                    <MdEmail/>
                </a>
                <a
                    href={`https://github.com/odisfm/fretyorb`}
                    target={'_blank'}
                    className={linkButtonStyles}
                >
                    <FaGithub/>
                </a></div>

        </footer>
    )
}