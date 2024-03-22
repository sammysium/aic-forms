export const styles = {
    labelInputContainers: {
        container: "grid w-full max-w-sm items-center gap-1.5 my-2",
        input: ""
    },
    activeContainer: "border border-8 border-black",
    inActiveContainer: "border border-1 border-gray",
    questions: {
        container: "px-4 py-2 w-full flex flex-col",
        header: "flex w-full space-x-4 mb-4",
        label: "font-bold",
        toolTip: "",
        body: "mt-12 mb-4",
        description: "text-sm",
        actionButtons: "flex w-full justify-end space-x-4",
        questionBlock: "flex items-center w-full",
        questionChildren: "flex-grow",
        preSuffixContainter: "flex m-4",
        preSuffix: "flex items-center justify-center border bg-gray-500 rounded-l px-8",
        trashIcon: {marginRight: '8px'}
    },
    errorMessage: "text-red-500 p-4 w-full",
    radio: "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    radioLabel: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    containerWithTextInputs : "flex flex-row h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"

}