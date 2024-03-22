export interface IConfig {
    multiplesFieldMaxValue: number,
    uploadDocTypes: string[]
}
export const config : IConfig = {
    multiplesFieldMaxValue: 10,
    uploadDocTypes: ["doc", "docx", "pdf", "xls", "xlsx", "png", "jpg"]
}