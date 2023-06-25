import {RawActivity} from "./rawActivity";
import {parse} from "node-html-parser";

export function getNameFromActivity(rawActivity: RawActivity): string {
    const {
        al_cal_userlink,
    } = rawActivity;

    const root = parse(al_cal_userlink);
    if (!root.firstChild) {
        console.log('raw error', JSON.stringify(rawActivity));
    }
    const url = new URL(
        // @ts-ignore
        'http://dontcare.com/' + root.firstChild.attributes.href
    );

    return root.firstChild.rawText
}
