export const stringfyTitle = (text) => {
    if (text) {
        const brackets_pattern = /\s*\([^)]*\)/;
        const arrays_pattern = /\s*\[[^\]]*\]/;

        const text_without_brackets = text.replace(brackets_pattern, "");
        const stringfied_title = text_without_brackets.replace(arrays_pattern, "");

        return stringfied_title;
    }
    return '';
}