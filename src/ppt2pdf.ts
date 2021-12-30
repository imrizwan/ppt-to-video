import { exec } from "child_process";

export const ppt2pdf = (file: string, output: string) => {
    exec(`soffice --headless --convert-to pdf --outdir ${output} ${file}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
        console.log(stderr);
    });
}