import React from "react";

export default function Page(props: {
  params: {
    coverId: string;
  };
}) {
  return <div>Page - {props.params.coverId}</div>;
}
