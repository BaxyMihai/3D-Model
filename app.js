import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js"; // Import the Three.js library
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js"; // Import the GLTF loader for loading 3D models
import { gsap } from "https://cdn.skypack.dev/gsap"; // Import GSAP for animations

// Create a new PerspectiveCamera with specific field of view, aspect ratio, near, and far clipping planes
const camera = new THREE.PerspectiveCamera(
  10, // Field of view
  window.innerWidth / innerHeight, // Aspect ratio based on window dimensions
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 13; // Set the camera position along the z-axis

const scene = new THREE.Scene(); // Create a new scene for rendering
let bee; // Declare a variable to hold the bee model
let mixer; // Declare a variable for the animation mixer
const loader = new GLTFLoader(); // Create a new instance of the GLTFLoader

// Load the bee model from the specified URL
loader.load(
  "./bee.glb",
  function (gltf) {
    // Success callback
    bee = gltf.scene; // Assign the loaded model to the bee variable
    scene.add(bee); // Add the bee model to the scene

    mixer = new THREE.AnimationMixer(bee); // Create an animation mixer for the bee model
    mixer.clipAction(gltf.animations[1]).play(); // Play the second animation clip of the model
    modelMove(); // Call the modelMove function to position the model
  },
  function (xhr) {}, // Progress callback (currently empty)
  function (error) {} // Error callback (currently empty)
);

const renderer = new THREE.WebGLRenderer({ alpha: true }); // Create a WebGL renderer with transparency
renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the renderer to the window dimensions
document.getElementById("container3D").appendChild(renderer.domElement); // Append the renderer's canvas to the DOM

// Create ambient light and add it to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3); // Create an ambient light with white color and intensity 1.3
scene.add(ambientLight); // Add the ambient light to the scene

// Create a directional light and position it
const topLight = new THREE.DirectionalLight(0xffffff, 1); // Create a directional light with white color and intensity 1
topLight.position.set(500, 500, 500); // Set the position of the light source
scene.add(topLight); // Add the directional light to the scene

// Function to continuously render the 3D scene
const reRender3D = () => {
  requestAnimationFrame(reRender3D); // Request the next frame for rendering
  renderer.render(scene, camera); // Render the scene from the camera's perspective
  if (mixer) mixer.update(0.004); // Update the animation mixer if it exists
};
reRender3D(); // Start the rendering loop

// Array of positions and rotations for the bee model corresponding to different sections
let arrPositionModel = [
  {
    id: "banner", // Identifier for the section
    position: { x: -0.3, y: -15, z: -250 }, // Position coordinates for the bee model
    rotation: { x: 0, y: 1.5, z: 0 }, // Rotation angles for the bee model
  },
  {
    id: "intro", // Identifier for the section
    position: { x: 25, y: -3, z: -350 }, // Position coordinates for the bee model
    rotation: { x: 0, y: -1.5, z: 0 }, // Rotation angles for the bee model
  },
  {
    id: "description", // Identifier for the section
    position: { x: 10, y: -9, z: -150 }, // Position coordinates for the bee model
    rotation: { x: 0, y: -1.5, z: 0 }, // Rotation angles for the bee model
  },
  {
    id: "contact", // Identifier for the section
    position: { x: -20, y: 3, z: -450 }, // Position coordinates for the bee model
    rotation: { x: 0, y: 1, z: 0 }, // Rotation angles for the bee model
  },
];

// Function to move the bee model based on scroll position
const modelMove = () => {
  const sections = document.querySelectorAll(".section"); // Select all sections with the class 'section'
  let currentSection; // Variable to hold the currently active section
  sections.forEach((section) => {
    // Loop through each section
    const rect = section.getBoundingClientRect(); // Get the bounding rectangle of the section
    if (rect.top <= window.innerHeight / 3) {
      // Check if the section is within the top third of the viewport
      currentSection = section.id; // Assign the ID of the current section to currentSection
    }
  });

  // Check the window width to determine if it's mobile
  if (window.innerWidth <= 768) {
    // If the window width is less than or equal to 768 pixels
    // Adjust the breakpoint as needed
    if (bee) {
      // If the bee model exists
      bee.visible = false; // Make the bee invisible on mobile
    }
    return; // Exit the function early for mobile
  } else {
    if (bee) {
      // If the bee model exists
      bee.visible = true; // Make the bee visible on larger screens
    }
  }

  let position_active = arrPositionModel.findIndex(
    // Find the index of the active section in the array
    (val) => val.id == currentSection // Compare the section ID
  );
  if (position_active >= 0) {
    // If the active section is found in the array
    let new_coordinates = arrPositionModel[position_active]; // Get the coordinates for the active section

    // Adjust the z position based on the window width for responsiveness
    const responsiveZ = new_coordinates.position.z * (window.innerWidth / 1200); // Adjust the z-coordinate based on window width

    // Animate the position of the bee model using GSAP
    gsap.to(bee.position, {
      x: new_coordinates.position.x, // Move to the new x position
      y: new_coordinates.position.y, // Move to the new y position
      z: new_coordinates.position.z, // Move to the new z position
      duration: 3, // Animation duration
      ease: "power1.out", // Animation easing function
    });
    // Animate the rotation of the bee model using GSAP
    gsap.to(bee.rotation, {
      x: new_coordinates.rotation.x, // Rotate to the new x angle
      y: new_coordinates.rotation.y, // Rotate to the new y angle
      z: new_coordinates.rotation.z, // Rotate to the new z angle
      duration: 3, // Animation duration
      ease: "power1.out", // Animation easing function
    });
  }
};

// Add an event listener for scroll events
window.addEventListener("scroll", () => {
  if (bee) {
    // If the bee model exists
    modelMove(); // Call the modelMove function to adjust the bee position
  }
});

// Add an event listener for window resize events
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight); // Update the renderer size on window resize
  camera.aspect = window.innerWidth / innerHeight; // Update the camera aspect ratio
  camera.updateProjectionMatrix(); // Update the camera's projection matrix
});

// Additional Code: Event listener for handling container resizing
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight); // Update the renderer size on window resize
  camera.aspect = window.innerWidth / window.innerHeight; // Update the camera aspect ratio
  camera.updateProjectionMatrix(); // Update the camera's projection matrix
  modelMove(); // Call modelMove to reposition the model if necessary
});
