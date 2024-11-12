export class AutocompleteResult {
    uri: string;
    value: string;
    link: string;
}

export class GroupAutocompleteResult {
    group: string;
    data: AutocompleteResult[];
}