import React from "react";
// @ts-ignore
import { create } from 'react-test-renderer';
import PaginationComponent from "./PaginationComponent";

describe ("Paginator component test", () => {
    test("pages count is 11 but should be showed only 10", () => {
        const component = create(<PaginationComponent totalUsersCount={11} pageSize={1} portionSize={10} />);
        const root = component.root;
        let spans = root.findAllByType("span");
        expect(spans.length).toBe(10);
        });
    test("if pages count is more then 10 button NEXT should be present", ()=>{
       const component = create(<PaginationComponent totalUsersCount={11} pageSize={1} portionSize={10} />);
        const root = component.root;
        let spans = root.findAllByType("Button");
        expect(spans.length).toBe(1);
    });
    })