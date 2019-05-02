import React from "react";
import { FormGroup, Label, Input } from "reactstrap";
import { Query } from "react-apollo";
import gql from "graphql-tag.macro";

const QUERY = gql`
  query Interfaces {
    interfaces {
      id
      name
      simulatorId
      config
      components
    }
  }
`;

export default ({ updateArgs, args }) => {
  return (
    <Query query={QUERY}>
      {({ loading, data }) => {
        if (loading) return null;
        const selectedInterface = data.interfaces.find(i => i.id === args.id);
        return (
          <FormGroup className="macro-template">
            <Label>
              Interface <small>The interface with the object</small>
              <Input
                type="select"
                value={args.id || "nothing"}
                onChange={e => updateArgs("id", e.target.value)}
              >
                <option value={"nothing"} disabled>
                  Choose an interface
                </option>
                {data.interfaces
                  .filter(i => !i.simulatorId)
                  .map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
              </Input>
            </Label>
            {selectedInterface && (
              <Label>
                Video{" "}
                <small>
                  The video on the selected interface. Must have an object
                  label.
                </small>
                <Input
                  type="select"
                  value={args.objectId || "nothing"}
                  onChange={e => updateArgs("objectId", e.target.value)}
                >
                  <option value={"nothing"} disabled>
                    Choose an object
                  </option>
                  {Object.entries(selectedInterface.config)
                    .map(([id, values]) => {
                      return [
                        id,
                        {
                          ...values,
                          componentType: selectedInterface.components.find(
                            i => i.id === id
                          ).component.name
                        }
                      ];
                    })
                    .filter(
                      c => c[1].objectLabel && c[1].componentType === "Video"
                    )
                    .map(([id, { objectLabel }]) => (
                      <option key={id} value={id}>
                        {objectLabel}
                      </option>
                    ))}
                </Input>
              </Label>
            )}
          </FormGroup>
        );
      }}
    </Query>
  );
};
