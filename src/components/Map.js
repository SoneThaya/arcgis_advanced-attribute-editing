import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const Map = () => {
  const MapEl = useRef(null);

  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/widgets/FeatureForm",
      "esri/layers/FeatureLayer",
      "esri/form/elements/FieldElement",
      "esri/form/elements/GroupElement",
    ]).then(
      ([
        Map,
        MapView,
        FeatureForm,
        FeatureLayer,
        FieldElement,
        GroupElement,
      ]) => {
        let highlight, editFeature;

        // Create feature layer
        const featureLayer = new FeatureLayer({
          portalItem: {
            id: "1e6a26701cd94ca1880e6fc9c908f410", // Citizen problems portal layer
          },
          outFields: ["*"],
        });

        const map = new Map({
          basemap: "topo-vector",
          layers: [featureLayer],
        });

        const view = new MapView({
          map: map,
          container: "viewDiv",
          center: [-88.149, 41.773],
          zoom: 14,
        });

        // Create field and group elements to add to form template

        // Individual field elements to display
        const fieldStatus = new FieldElement({
          fieldName: "status",
          editable: false,
          label: "Issue status",
          description: "E.g. submitted, received, in progress, or completed.",
        });

        const fieldResolution = new FieldElement({
          fieldName: "resolution",
          label: "Resolution",
          editable: false,
          description: "Resolution if status is set to Completed",
          visibilityExpression:
            "($feature:any.status == 'Completed') && (!(IsEmpty($feature:any.resolution)))",
        });

        // The following field elements will display within the first group element
        const fieldCat = new FieldElement({
          fieldName: "category",
          label: "Category",
        });

        const fieldAnimal = new FieldElement({
          fieldName: "AnimalProbType",
          label: "Animal problem type",
          visibilityExpression: "$feature:any.category == 'Animal'",
          description: "E.g. barking dog, bite, etc.",
        });

        const fieldBlight = new FieldElement({
          fieldName: "BlightProbType",
          label: "Blight problem type",
          description: "E.g. graffiti, abandoned vehicle, etc.",
          visibilityExpression: "$feature:any.category == 'Blight'",
        });

        const fieldHealth = new FieldElement({
          fieldName: "HealthProbType",
          label: "Health problem type",
          description: "E.g. food poisoning, mosquito, etc.",
          visibilityExpression: "$feature.category == 'Health'",
        });

        const fieldLandUse = new FieldElement({
          fieldName: "LanUseProbType",
          label: "Land Use problem type",
          description: "E.g. illegal parking, work without permit, etc.",
          visibilityExpression: "$feature.category == 'Land Use'",
        });

        const fieldParkTree = new FieldElement({
          fieldName: "ParktreeProbType",
          label: "Park/Tree problem type",
          description: "E.g. unsafe tree, light out, etc.",
          visibilityExpression: "$feature.category == 'Park/Tree'",
        });

        const fieldRoad = new FieldElement({
          fieldName: "RoadProbType",
          label: "Road problem type",
          description: "E.g. pothole, sidewalk damage, etc.",
          visibilityExpression: "$feature.category == 'Road'",
        });

        const fieldSnowIce = new FieldElement({
          fieldName: "RoadProbType",
          label: "Road problem type",
          description: "E.g. pothole, sidewalk damage, etc.",
          visibilityExpression: "$feature.category == 'Road'",
        });

        const fieldTrash = new FieldElement({
          fieldName: "TrashProbType",
          label: "Trash problem type",
          description: "E.g. bulk item pickup, recycling pickup, etc.",
          visibilityExpression: "$feature.category == 'Trash'",
        });

        const fieldUtilities = new FieldElement({
          fieldName: "UtiltiesProbType",
          label: "Utility problem type",
          description: "E.g. storm drain clog, water leak, etc.",
          visibilityExpression: "$feature.category == 'Utility'",
        });

        const fieldDetails = new FieldElement({
          fieldName: "details",
          label: "Details",
          description: "Enter additional details about the problem",
          // If the category is a value and the sub categories are NOT NULL, show the details field
          visibilityExpression:
            "($feature.category == 'Animal' && (!IsEmpty($feature.AnimalProbType))) || ($feature.category == 'Blight' && (!IsEmpty($feature.BlightProbType))) || ($feature.category == 'Health' && (!IsEmpty($feature.HealthProbType))) || ($feature.category == 'Land Use' && (!IsEmpty($feature.LanUseProbType))) || ($feature.category == 'Park/Tree' && (!IsEmpty($feature.ParktreeProbtype))) || ($feature.category == 'Road' && (!IsEmpty($feature.RoadProbtype))) || ($feature.category == 'Snow/Ice' && (!IsEmpty($feature.SnowIceProbtype))) || ($feature.category == 'Trash' && (!IsEmpty($feature.TrashProbType))) || ($feature.category == 'Utility' && (!IsEmpty($feature.UtiltiesProbType)))",
        });

        // Create a group element and pass in the above field elements
        const groupUpdate = new GroupElement({
          label: "Update issue",
          description:
            "If work has not yet begun on issue, categorize and detail the problem",
          visibilityExpression:
            "($feature:any.status == 'Submitted') || ($feature:any.status == 'Received')",
          elements: [
            fieldCat,
            fieldAnimal,
            fieldBlight,
            fieldHealth,
            fieldLandUse,
            fieldParkTree,
            fieldRoad,
            fieldRoad,
            fieldSnowIce,
            fieldTrash,
            fieldUtilities,
            fieldDetails,
          ],
        });

        // Create field elements to pass into second group element

        const fieldFirst = new FieldElement({
          fieldName: "pocfirstname",
          label: "First name",
        });

        const fieldLast = new FieldElement({
          fieldName: "poclastname",
          label: "Last name",
        });

        const fieldPhone = new FieldElement({
          fieldName: "pocphone",
          label: "Telephone number",
          // Only show the telephone and email fields if both first and last names are entered
          visibilityExpression:
            "((!IsEmpty($feature.pocfirstname)) && (!IsEmpty($feature.poclastname))) ",
        });

        const fieldEmail = new FieldElement({
          fieldName: "pocemail",
          label: "Email",
          visibilityExpression:
            "((!IsEmpty($feature.pocfirstname)) && (!IsEmpty($feature.poclastname))) ",
        });

        // Create second group element and pass in the above four field elements to it
        const groupPOC = new GroupElement({
          label: "Point of contact information",
          description: "Who should we contact regarding this problem?",
          elements: [fieldFirst, fieldLast, fieldPhone, fieldEmail],
        });

        // Add a new feature form and pass in the group and field elements from above
        const form = new FeatureForm({
          container: "form",
          groupDisplay: "sequential",
          formTemplate: {
            // Autocasts to FormTemplate
            title: "Report issues",
            description: "Provide information to the questions below",
            elements: [fieldStatus, fieldResolution, groupUpdate, groupPOC],
          },
        });

        view.on("click", (event) => {
          // Unselect any currently selected features
          unselectFeature();
          // Listen for when the user clicks on the view
          view.hitTest(event).then((response) => {
            // If user selects a feature, select it
            const results = response.results;
            if (
              results.length > 0 &&
              results[0].graphic &&
              results[0].graphic.layer === featureLayer
            ) {
              selectFeature(
                results[0].graphic.attributes[featureLayer.objectIdField]
              );
            } else {
              // Hide the form and show the info div
              document.getElementById("update").classList.add("esri-hidden");
            }
          });
        });

        // Function to unselect features
        function unselectFeature() {
          if (highlight) {
            highlight.remove();
          }
        }

        // Highlight the clicked feature and display
        // its attributes in the featureform.
        function selectFeature(objectId) {
          // query feature from the server
          featureLayer
            .queryFeatures({
              objectIds: [objectId],
              outFields: ["*"],
              returnGeometry: true,
            })
            .then((results) => {
              if (results.features.length > 0) {
                editFeature = results.features[0];

                // display the attributes of selected feature in the form
                form.feature = editFeature;

                // highlight the feature on the view
                view.whenLayerView(editFeature.layer).then((layerView) => {
                  highlight = layerView.highlight(editFeature);
                });

                if (
                  document
                    .getElementById("update")
                    .classList.contains("esri-hidden")
                ) {
                  document.getElementById("info").classList.add("esri-hidden");
                  document
                    .getElementById("update")
                    .classList.remove("esri-hidden");
                }
              }
            });
        }

        // Listen to the feature form's submit event.
        form.on("submit", () => {
          if (editFeature) {
            // Grab updated attributes from the form.
            const updated = form.getValues();

            // Loop through updated attributes and assign
            // the updated values to feature attributes.
            Object.keys(updated).forEach((name) => {
              editFeature.attributes[name] = updated[name];
            });

            // Setup the applyEdits parameter with updates.
            const edits = {
              updateFeatures: [editFeature],
            };
            applyAttributeUpdates(edits);
          }
        });

        // Call FeatureLayer.applyEdits() with specified params.
        function applyAttributeUpdates(params) {
          document.getElementById("btnUpdate").style.cursor = "progress";
          featureLayer
            .applyEdits(params)
            .then((editsResult) => {
              // Get the objectId of the newly added feature.
              // Call selectFeature function to highlight the new feature.
              if (editsResult.addFeatureResults.length > 0) {
                const objectId = editsResult.addFeatureResults[0].objectId;
                selectFeature(objectId);
              }
              document.getElementById("btnUpdate").style.cursor = "pointer";
            })
            .catch((error) => {
              console.log("===============================================");
              console.error(
                "[ applyEdits ] FAILURE: ",
                error.code,
                error.name,
                error.message
              );
              console.log("error = ", error);
              document.getElementById("btnUpdate").style.cursor = "pointer";
            });
        }

        document.getElementById("btnUpdate").onclick = () => {
          // Fires feature form's submit event.
          form.submit();
        };

        view.ui.add("update", "top-right");
        view.ui.add("info", {
          position: "top-left",
          index: 1,
        });
      }
    );
  }, []);

  return (
    <>
      <div
        id="viewDiv"
        style={{ height: "100vh", width: "100vw" }}
        ref={MapEl}
      ></div>
      <div id="info" class="esri-widget">
        <h3>Select a feature to begin editing</h3>
        <h4>
          You will only be able to update an issue if work has not yet begun on
          it, e.g. status is either 'Submitted' or 'Received'.
          <p>
            If work has already begun, you have the ability to update the
            contact information. If no first and last names are provided, no
            option is given to enter a telephone number or email.
          </p>
        </h4>
      </div>

      <div id="update" class="esri-widget esri-hidden">
        <div id="form" class="scroller esri-component"></div>
        <input
          type="button"
          class="esri-button"
          value="Update assessment"
          id="btnUpdate"
        />
      </div>
    </>
  );
};

export default Map;
