import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const CHAPTER_CONTENT: Record<string, {
  quiz: { text: string; options: string[]; correctAnswer: number; explanation: string }[];
  written: string;
  supplements: { title: string; link: string }[];
}> = {
  "Number Systems": {
    quiz: [
      { text: "Every rational number is a:", options: ["Natural number", "Integer", "Real number", "Whole number"], correctAnswer: 2, explanation: "Real numbers include both rational and irrational numbers." },
      { text: "Between two rational numbers, there are:", options: ["Infinitely many rational numbers", "Exactly one rational number", "No rational number", "No irrational number"], correctAnswer: 0, explanation: "The set of rational numbers is 'dense', meaning between any two, another can always be found." },
      { text: "What is the decimal representation of an irrational number?", options: ["Terminating", "Non-terminating repeating", "Non-terminating non-repeating", "None of these"], correctAnswer: 2, explanation: "Irrational numbers like √2 or Pi have decimals that never end and never repeat a pattern." },
      { text: "The value of (64)^(1/2) is:", options: ["8", "4", "16", "32"], correctAnswer: 0, explanation: "64 is 8 squared, so its square root is 8." },
      { text: "Which of the following is irrational?", options: ["√4", "√9", "√7", "√25"], correctAnswer: 2, explanation: "√4=2, √9=3, √25=5 (all rational). √7 cannot be expressed as a fraction." }
    ],
    written: `1. [Easy] Show that 0.333... (0.3 bar) can be expressed in the form p/q, where p and q are integers and q ≠ 0.
2. [Easy] Classify the following numbers as rational or irrational: (a) √23 (b) √225 (c) 0.3796.
3. [Medium] Rationalize the denominator of 1/(√7 - √6). Show each step of the multiplication.
4. [Medium] Find three different irrational numbers between the rational numbers 5/7 and 9/11.
5. [Hard] Simplify by rationalizing: (7√3 - 5√2) / (√48 + √18). Discuss the importance of rationalization in simplifying expressions.`,
    supplements: [
      { title: "Pi: The Never-Ending Mystery 🥧", link: "https://en.wikipedia.org/wiki/Pi" },
      { title: "Vedic Math Tricks 🧮", link: "https://en.wikipedia.org/wiki/Vedic_Mathematics" }
    ]
  },
  "Polynomials": {
    quiz: [
      { text: "What is the degree of a non-zero constant polynomial?", options: ["0", "1", "Not defined", "Any natural number"], correctAnswer: 0, explanation: "A constant like 5 can be written as 5x^0, so its degree is 0." },
      { text: "The zeroes of the polynomial p(x) = x^2 - 3x is/are:", options: ["0 only", "3 only", "0 and 3", "0 and -3"], correctAnswer: 2, explanation: "x(x-3) = 0 gives x=0 and x=3." },
      { text: "Which of the following is a cubic polynomial?", options: ["x^2 + 1", "x^3 + 2x + 1", "x + 5", "x^4 - 1"], correctAnswer: 1, explanation: "A cubic polynomial has the highest power (degree) as 3." },
      { text: "The value of (x+y+z)^2 is:", options: ["x^2+y^2+z^2+2xy+2yz+2zx", "x^2+y^2+z^2-2xy-2yz-2zx", "x^3+y^3+z^3", "None"], correctAnswer: 0, explanation: "This is a standard algebraic identity." },
      { text: "If (x-1) is a factor of p(x), then p(1) must be:", options: ["1", "0", "-1", "Any value"], correctAnswer: 1, explanation: "According to the Factor Theorem, if (x-a) is a factor, then p(a) = 0." }
    ],
    written: `1. [Easy] Find the value of the polynomial 5x - 4x² + 3 at x = 0 and x = -1.
2. [Easy] Verify whether 2 and 0 are zeroes of the polynomial x² - 2x.
3. [Medium] Factorise x² + 9x + 18 by splitting the middle term. Show the factors clearly.
4. [Medium] Use a suitable identity to find the product of (x + 8)(x - 10).
5. [Hard] Factorise x³ - 23x² + 142x - 120 using the Factor Theorem and long division.`,
    supplements: [
      { title: "Zero: India's Gift 🇮🇳", link: "https://en.wikipedia.org/wiki/0" },
      { title: "Algebraic Patterns in Art 🎨", link: "https://en.wikipedia.org/wiki/Mathematics_and_art" }
    ]
  },
  "Coordinate Geometry": {
    quiz: [
      { text: "The point of intersection of the X and Y axes is called:", options: ["Abscissa", "Ordinate", "Origin", "Quadrant"], correctAnswer: 2, explanation: "The origin is the point (0,0) where the axes meet." },
      { text: "The distance of a point from the Y-axis is called its:", options: ["Abscissa", "Ordinate", "Origin", "Coordinate"], correctAnswer: 0, explanation: "The x-coordinate (abscissa) tells the distance from the Y-axis." },
      { text: "In which quadrant does the point (-3, -5) lie?", options: ["I", "II", "III", "IV"], correctAnswer: 2, explanation: "Both x and y are negative in the Third Quadrant." },
      { text: "Any point on the X-axis is of the form:", options: ["(y, 0)", "(0, x)", "(x, 0)", "(x, y)"], correctAnswer: 2, explanation: "On the X-axis, the y-coordinate is always zero." },
      { text: "The ordinate of every point in the fourth quadrant is:", options: ["Positive", "Negative", "Zero", "Not fixed"], correctAnswer: 1, explanation: "In the IV quadrant, x is positive but y (ordinate) is negative." }
    ],
    written: `1. [Easy] Write the coordinates of the origin. In which quadrants do the signs of coordinates remain the same (e.g., both positive or both negative)?
2. [Easy] Find the abscissa and ordinate of the points: A(4, -3) and B(-2, 5).
3. [Medium] Plot the points (0, 5), (-3, 0), and (2, -4) on a Cartesian plane. Label each point.
4. [Medium] Describe the position of a point that lies: (a) 4 units above the X-axis on the Y-axis (b) 3 units to the left of the Y-axis on the X-axis.
5. [Hard] Plot the points P(1, 1), Q(1, 4), and R(4, 4). If PQRS is a square, find the coordinates of S and plot it. Calculate the area of the square.`,
    supplements: [
      { title: "René Descartes 👨‍🎨", link: "https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes" },
      { title: "GPS and Coordinates 🛰️", link: "https://en.wikipedia.org/wiki/Global_Positioning_System" }
    ]
  },
  "Linear Equations in Two Variables": {
    quiz: [
      { text: "A linear equation in two variables has how many solutions?", options: ["Exactly one", "Exactly two", "Infinitely many", "No solution"], correctAnswer: 2, explanation: "For every value of x, you can find a corresponding value for y." },
      { text: "The graph of the linear equation y = mx is a line which:", options: ["is parallel to x-axis", "is parallel to y-axis", "passes through origin", "None"], correctAnswer: 2, explanation: "Since it has no constant term, it passes through (0,0)." },
      { text: "Which of the following is a linear equation in two variables?", options: ["2x + 5 = 0", "x^2 + y = 10", "3x + 4y = 12", "x/y = 5"], correctAnswer: 2, explanation: "It follows the form ax + by + c = 0." },
      { text: "The equation x = 7, in two variables, can be written as:", options: ["1.x + 1.y = 7", "1.x + 0.y = 7", "0.x + 1.y = 7", "0.x + 0.y = 7"], correctAnswer: 1, explanation: "The y-coefficient is zero." },
      { text: "The point (3, 4) lies on the graph of 3y = ax + 7. The value of 'a' is:", options: ["5/3", "3/5", "1", "2"], correctAnswer: 0, explanation: "3(4) = a(3) + 7 => 12 = 3a + 7 => 3a = 5 => a = 5/3." }
    ],
    written: `1. [Easy] Express the linear equation 2x + 3y = 9.35 (bar on 5) in the form ax + by + c = 0 and indicate the values of a, b, and c.
2. [Easy] Write four solutions for the equation 2x + y = 7.
3. [Medium] Draw the graph of the linear equation x + y = 4. Show the points where it intersects the axes.
4. [Medium] The taxi fare in a city is: For the first km, it is ₹8 and for every subsequent km, it is ₹5. Write a linear equation.
5. [Hard] Yamini and Fatima together contributed ₹100 towards the PM's Relief Fund. Write a linear equation and draw its graph. How does the graph change if they contribute different amounts?`,
    supplements: [
      { title: "Simple Graphs 📈", link: "https://en.wikipedia.org/wiki/Graph_of_a_function" },
      { title: "Math in Budgets 💰", link: "https://en.wikipedia.org/wiki/Linear_programming" }
    ]
  },
  "Introduction to Euclid’s Geometry": {
    quiz: [
      { text: "The word 'Geometry' comes from the Greek words 'geo' and 'metrein' meaning:", options: ["Sky and Earth", "Earth and Measure", "Shape and Size", "Dots and Lines"], correctAnswer: 1, explanation: "Geo = Earth, Metrein = Measure." },
      { text: "A point is that which has:", options: ["No part", "One part", "Two parts", "Three parts"], correctAnswer: 0, explanation: "Euclid defined a point as a dimensionless entity." },
      { text: "Straight lines are parallel if they do not intersect. This is a:", options: ["Axiom", "Postulate", "Definition", "Theorem"], correctAnswer: 2, explanation: "Euclid defined parallel lines in his definitions." },
      { text: "Things which are equal to the same thing are _____ to one another.", options: ["Not equal", "Parallel", "Equal", "Independent"], correctAnswer: 2, explanation: "This is Euclid's first axiom." },
      { text: "Euclid's fifth postulate is about:", options: ["Right angles", "Straight lines", "Parallel lines", "Circles"], correctAnswer: 2, explanation: "The famous 'Parallel Postulate'." }
    ],
    written: `1. [Easy] Define the following terms: (a) Parallel lines (b) Perpendicular lines (c) Radius of a circle.
2. [Easy] State Euclid's first five axioms in your own words.
3. [Medium] If a point C lies between two points A and B such that AC = BC, then prove that AC = 1/2 AB. Draw a figure to explain.
4. [Medium] In a figure, if AC = BD, then prove that AB = CD. Use Euclid's axioms to justify your proof.
5. [Hard] Discuss the 'Parallel Postulate'. Why was it controversial in the history of mathematics, and what kind of 'Non-Euclidean' geometries did its study lead to?`,
    supplements: [
      { title: "Euclid: Father of Geometry 🏛️", link: "https://en.wikipedia.org/wiki/Euclid" },
      { title: "Ancient Math Tools 📐", link: "https://en.wikipedia.org/wiki/History_of_geometry" }
    ]
  },
  "Lines and Angles": {
    quiz: [
      { text: "If two lines intersect, the vertically opposite angles are:", options: ["Supplementary", "Complementary", "Equal", "Unequal"], correctAnswer: 2, explanation: "This is a basic theorem of geometry." },
      { text: "An angle which is greater than 180° but less than 360° is called:", options: ["Obtuse", "Straight", "Reflex", "Complete"], correctAnswer: 2, explanation: "A reflex angle exceeds a straight angle (180°)." },
      { text: "The sum of all angles around a point is:", options: ["90°", "180°", "270°", "360°"], correctAnswer: 3, explanation: "A complete rotation is 360°." },
      { text: "If a ray stands on a line, the sum of two adjacent angles so formed is:", options: ["90°", "180°", "360°", "Depends on ray"], correctAnswer: 1, explanation: "This is the 'Linear Pair Axiom'." },
      { text: "When a transversal cuts two parallel lines, the alternate interior angles are:", options: ["Equal", "Supplementary", "90°", "Unequal"], correctAnswer: 0, explanation: "Properties of parallel lines." }
    ],
    written: `1. [Easy] Define: (a) Supplementary angles (b) Complementary angles (c) Linear pair of angles.
2. [Easy] If an angle is half of its complement, find the measure of the angle.
3. [Medium] In a figure, lines AB and CD intersect at O. If ∠AOC + ∠BOE = 70° and ∠BOD = 40°, find ∠BOE and reflex ∠COE.
4. [Medium] Prove that if two lines intersect, the vertically opposite angles are equal. Draw a diagram and provide a formal proof.
5. [Hard] Two parallel lines are intersected by a transversal. Prove that the bisectors of any two alternate interior angles are parallel to each other.`,
    supplements: [
      { title: "Architectural Symmetry 🏛️", link: "https://en.wikipedia.org/wiki/Symmetry" },
      { title: "Navigation and Angles 🧭", link: "https://en.wikipedia.org/wiki/Navigation" }
    ]
  },
  "Triangles": {
    quiz: [
      { text: "Which is the longest side in a right-angled triangle?", options: ["Base", "Perpendicular", "Hypotenuse", "None"], correctAnswer: 2, explanation: "The hypotenuse is opposite the largest angle (90°)." },
      { text: "In an isosceles triangle, the angles opposite to equal sides are:", options: ["Equal", "Unequal", "Supplementary", "90°"], correctAnswer: 0, explanation: "A fundamental property of isosceles triangles." },
      { text: "State the ASA congruence rule.", options: ["Side-Side-Side", "Angle-Side-Angle", "Angle-Angle-Side", "Side-Angle-Side"], correctAnswer: 1, explanation: "Two angles and the included side." },
      { text: "The sum of any two sides of a triangle is ___ the third side.", options: ["Greater than", "Less than", "Equal to", "None"], correctAnswer: 0, explanation: "The 'Triangle Inequality Theorem'." },
      { text: "A triangle in which all three sides are equal is:", options: ["Scalene", "Isosceles", "Equilateral", "Right-angled"], correctAnswer: 2, explanation: "Equi = Equal, Lateral = Side." }
    ],
    written: `1. [Easy] Name and sketch the different types of triangles based on their sides and angles.
2. [Easy] State the AAS and SAS congruence criteria for two triangles.
3. [Medium] ABC is an isosceles triangle with AB = AC. Draw AP ⊥ BC to show that ∠B = ∠C.
4. [Medium] In ΔABC, the bisector AD of ∠A is perpendicular to side BC. Show that ΔABC is isosceles.
5. [Hard] Prove the 'SSS' congruence rule using other congruence rules. Discuss Warum the 'AAA' criterion is not sufficient for congruence but is used for similarity.`,
    supplements: [
      { title: "The Bermuda Triangle ⚓", link: "https://en.wikipedia.org/wiki/Bermuda_Triangle" },
      { title: "Structural Strength 🏗️", link: "https://en.wikipedia.org/wiki/Truss" }
    ]
  },
  "Quadrilaterals": {
    quiz: [
      { text: "The sum of the angles of a quadrilateral is:", options: ["180°", "360°", "540°", "720°"], correctAnswer: 1, explanation: "It can be divided into two triangles, each having 180°." },
      { text: "A quadrilateral with one pair of parallel sides is called a:", options: ["Parallelogram", "Rhombus", "Trapezium", "Square"], correctAnswer: 2, explanation: "A trapezium only requires one pair of parallel opposites." },
      { text: "In a parallelogram, the diagonals:", options: ["Are equal", "Are perpendicular", "Bisect each other", "None"], correctAnswer: 2, explanation: "Diagonals of a parallelogram divide each other into two equal parts." },
      { text: "Which property is unique to a Rhombus compared to a Parallelogram?", options: ["Opposite sides are parallel", "Opposite angles are equal", "All sides are equal", "Diagonals bisect each other"], correctAnswer: 2, explanation: "A rhombus is an equilateral parallelogram." },
      { text: "According to the Mid-point Theorem, the line joining midpoints of two sides of a triangle is:", options: ["Double the 3rd side", "Half of the 3rd side", "Equal to 3rd side", "None"], correctAnswer: 1, explanation: "It is parallel to the third side and half of it." }
    ],
    written: `1. [Easy] List the properties of a: (a) Parallelogram (b) Rectangle (c) Square.
2. [Easy] If the angles of a quadrilateral are in the ratio 3 : 5 : 9 : 13, find all the angles.
3. [Medium] Show that the diagonals of a rhombus bisect each other at right angles.
4. [Medium] State and prove the 'Mid-point Theorem' for a triangle. Include a clear diagram.
5. [Hard] Prove that the quadrilateral formed by joining the mid-points of the sides of any quadrilateral, in order, is a parallelogram.`,
    supplements: [
      { title: "Escher's Tessellations 🎨", link: "https://en.wikipedia.org/wiki/M._C._Escher" },
      { title: "Shapes in Nature 🍯", link: "https://en.wikipedia.org/wiki/Honeycomb" }
    ]
  },
  "Circles": {
    quiz: [
      { text: "Equal chords of a circle subtend ___ angles at the centre.", options: ["Unequal", "Equal", "Supplementary", "90°"], correctAnswer: 1, explanation: "A key theorem about chord properties." },
      { text: "The perpendicular from the centre of a circle to a chord ____ the chord.", options: ["Triples", "Bisects", "Doubles", "None"], correctAnswer: 1, explanation: "It divides the chord into two equal halves." },
      { text: "Angle subtended by a diameter at any point on the circle is:", options: ["45°", "90°", "180°", "60°"], correctAnswer: 1, explanation: "This is Thales's Theorem (Angle in a semi-circle)." },
      { text: "A quadrilateral whose vertices all lie on a circle is called:", options: ["Square", "Rhombus", "Cyclic", "Trapezium"], correctAnswer: 2, explanation: "Cyclic quadrilaterals have special angle properties." },
      { text: "The sum of opposite angles of a cyclic quadrilateral is:", options: ["90°", "180°", "360°", "None"], correctAnswer: 1, explanation: "Opposite angles in a cyclic quadrilateral are supplementary." }
    ],
    written: `1. [Easy] Define: (a) Segment (b) Sector (c) Chord. Draw a circle and label these parts.
2. [Easy] State the relationship between equal chords and their distances from the centre of the circle.
3. [Medium] Prove that the angle subtended by an arc at the centre is double the angle subtended by it at any point on the remaining part of the circle.
4. [Medium] Draw a circle of radius 3cm. Take two points P and Q on one of its diameters. Construct tangents to the circle from these points.
5. [Hard] A chord of a circle is equal to the radius of the circle. Find the angle subtended by the chord at a point on the minor arc and also at a point on the major arc.`,
    supplements: [
      { title: "Stonehenge Geometry 🗿", link: "https://en.wikipedia.org/wiki/Stonehenge" },
      { title: "Perfect Circles in Nature 🌐", link: "https://en.wikipedia.org/wiki/Sphere" }
    ]
  },
  "Heron’s Formula": {
    quiz: [
      { text: "In Heron's formula, 's' stands for:", options: ["Side", "Surface Area", "Semi-perimeter", "Sum"], correctAnswer: 2, explanation: "s = (a + b + c) / 2." },
      { text: "Which formula is used to find the area of a triangle with sides a, b, c?", options: ["1/2 * b * h", "√[s(s-a)(s-b)(s-c)]", "a + b + c", "None"], correctAnswer: 1, explanation: "This is Heron's Formula, named after Hero of Alexandria." },
      { text: "The area of an equilateral triangle with side 'a' is:", options: ["√3/4 * a^2", "1/2 * a^2", "√2/4 * a^2", "a^2"], correctAnswer: 0, explanation: "Derived from Heron's formula for equilateral case." },
      { text: "If the perimeter of a triangle is 42 cm and two sides are 18 cm and 10 cm, find the third side.", options: ["14 cm", "12 cm", "16 cm", "10 cm"], correctAnswer: 0, explanation: "42 - (18 + 10) = 14." },
      { text: "Heron was a scientist/mathematician from:", options: ["India", "Egypt", "Greece", "China"], correctAnswer: 2, explanation: "Hero of Alexandria was a Greco-Egyptian inventor and mathematician." }
    ],
    written: `1. [Easy] State Heron's formula and describe every variable used in it.
2. [Easy] Find the area of a triangle whose sides are 8 cm, 11 cm and 13 cm.
3. [Medium] An equilateral triangular park has a perimeter of 180 m. Find its area using Heron's formula.
4. [Medium] A triangular signboard has sides 5 cm, 12 cm, and 13 cm. Calculate its area. Verify if it's a right-angled triangle.
5. [Hard] A kite in the shape of a square with a diagonal 32 cm and an isosceles triangle of base 8 cm and sides 6 cm is made of three different shades. How much paper of each shade has been used?`,
    supplements: [
      { title: "Hero of Alexandria 🏛️", link: "https://en.wikipedia.org/wiki/Hero_of_Alexandria" },
      { title: "Triangle Area Calculator 📐", link: "https://en.wikipedia.org/wiki/Triangle" }
    ]
  },
  "Surface Areas and Volumes": {
    quiz: [
      { text: "The total surface area of a cube of side 'a' is:", options: ["4a^2", "6a^2", "a^3", "12a"], correctAnswer: 1, explanation: "It has 6 square faces, each having area a^2." },
      { text: "The volume of a sphere of radius 'r' is:", options: ["4/3 * πr^3", "πr^2h", "1/3 * πr^2h", "4πr^2"], correctAnswer: 0, explanation: "The volume formula for a perfect ball." },
      { text: "What is the curved surface area of a cone?", options: ["πrl", "2πrh", "πr^2h", "None"], correctAnswer: 0, explanation: "Where l is the slant height of the cone." },
      { text: "If the radius of a cylinder is doubled while height remains same, its volume becomes:", options: ["Double", "Triple", "Four times", "Eight times"], correctAnswer: 2, explanation: "V = πr^2h. Doubling r makes it (2r)^2 = 4r^2." },
      { text: "The lateral surface area of a cylinder is:", options: ["2πrh", "πr^2h", "2πr(r+h)", "None"], correctAnswer: 0, explanation: "Area of the curved side (circumference * height)." }
    ],
    written: `1. [Easy] Write all the formulas for Surface Area and Volume of: (a) Cylinder (b) Cone (c) Sphere.
2. [Easy] Find the total surface area of a hemisphere of radius 10 cm. (Use π = 3.14)
3. [Medium] A right circular cone has a height of 8 cm and a base radius of 6 cm. Find its slant height and volume.
4. [Medium] A dome of a building is in the form of a hemisphere. If the surface area is 249.48 m², find the volume of air inside the dome.
5. [Hard] Twenty-seven solid iron spheres, each of radius r and surface area S are melted to form a sphere with surface area S'. Find the radius r' of the new sphere and the ratio of S and S'.`,
    supplements: [
      { title: "Volume in Cooking 🍳", link: "https://en.wikipedia.org/wiki/Cooking_weights_and_measures" },
      { title: "Packing Efficiency 📦", link: "https://en.wikipedia.org/wiki/Packing_problems" }
    ]
  },
  "Statistics": {
    quiz: [
      { text: "The difference between the maximum and minimum values in a data set is called:", options: ["Mean", "Median", "Mode", "Range"], correctAnswer: 3, explanation: "Range gives the spread of the data." },
      { text: "What is the class mark of the class interval 10-20?", options: ["10", "20", "15", "30"], correctAnswer: 2, explanation: "Class mark = (Lower + Upper) / 2 = (10+20)/2 = 15." },
      { text: "A representation of data using rectangles of equal width and variable height is:", options: ["Frequency Polygon", "Histogram", "Pie Chart", "Pictograph"], correctAnswer: 1, explanation: "Histograms are used for continuous data." },
      { text: "The sum of observations divided by the total number of observations is:", options: ["Mean", "Median", "Mode", "Range"], correctAnswer: 0, explanation: "The average value." },
      { text: "In a frequency polygon, the points are plotted using:", options: ["Upper limit", "Lower limit", "Class marks", "None"], correctAnswer: 2, explanation: "Points are centered at class marks." }
    ],
    written: `1. [Easy] Define: (a) Primary data (b) Secondary data. Give one example of each.
2. [Easy] Find the range of the following heights (in cm) of 10 students: 150, 155, 142, 148, 160, 152, 145, 158, 153, 151.
3. [Medium] Construct a grouped frequency distribution table with class size 5 for the scores of 30 students in a test.
4. [Medium] Draw a histogram for the following distribution of marks of 50 students.
5. [Hard] Discuss the importance of data representation in decision making (e.g., during an election or a health crisis). Why can 'Mean' sometimes be misleading if there are outliers?`,
    supplements: [
      { title: "Florence Nightingale 🩺", link: "https://en.wikipedia.org/wiki/Florence_Nightingale" },
      { title: "Big Data & AI 🤖", link: "https://en.wikipedia.org/wiki/Big_data" }
    ]
  },
  "Probability": {
    quiz: [
      { text: "The probability of an impossible event is:", options: ["0", "1", "0.5", "Infinite"], correctAnswer: 0, explanation: "Something that cannot happen (like rolling a 7 on a die) has zero probability." },
      { text: "The sum of probabilities of all elementary events of an experiment is:", options: ["0", "0.5", "1", "Depends on event"], correctAnswer: 2, explanation: "Total probability is always 100% or 1." },
      { text: "If the probability of happening of an event is 0.35, the probability of it not happening is:", options: ["0.35", "0.65", "1", "0"], correctAnswer: 1, explanation: "P(not E) = 1 - P(E) = 1 - 0.35 = 0.65." },
      { text: "A coin is tossed 1000 times, and heads appear 455 times. The probability of getting a tail is:", options: ["0.455", "0.545", "1", "0.5"], correctAnswer: 1, explanation: "(1000-455)/1000 = 545/1000 = 0.545." },
      { text: "Probability can never be:", options: ["Greater than 1", "Less than 0", "Both A and B", "Neither A nor B"], correctAnswer: 2, explanation: "Probability always lies between 0 and 1 (inclusive)." }
    ],
    written: `1. [Easy] What is a 'Trial' and an 'Event' in probability? Give examples using a coin toss.
2. [Easy] A die is thrown once. What is the probability of getting: (a) An even number (b) A number greater than 4.
3. [Medium] A bag contains 3 red balls and 5 black balls. A ball is drawn at random. What is the probability that the ball drawn is: (a) red? (b) not red?
4. [Medium] Following are the weights of 30 students. Find the probability that a student chosen at random weighs more than 50 kg.
5. [Hard] Discuss 'Experimental' vs 'Theoretical' probability. If you toss a coin 10 times and get 8 heads, is the probability of head 0.8? Why does it change as you toss the coin more times?`,
    supplements: [
      { title: "Weather Forecasting 🌦️", link: "https://en.wikipedia.org/wiki/Weather_forecasting" },
      { title: "Game Theory ♟️", link: "https://en.wikipedia.org/wiki/Game_theory" }
    ]
  }
};

async function main() {
  console.log('✨ Seeding Quizzes, Written Sets, and Supplements for Math Class 9...');

  const subject = await prisma.subject.findFirst({
    where: { name: 'Math', class: 'Class 9' }
  });

  if (!subject) {
    console.error('Math Class 9 subject not found!');
    return;
  }

  const chapters = await prisma.chapter.findMany({
    where: { subjectId: subject.id }
  });

  for (const chapter of chapters) {
    const content = CHAPTER_CONTENT[chapter.title];
    if (!content) {
      console.log(`⚠️ No specific content found for chapter: ${chapter.title}`);
      continue;
    }

    // 1. Update Written Question (Pattern: 2 Easy, 2 Medium, 1 Hard)
    await prisma.chapter.update({
      where: { id: chapter.id },
      data: { writtenQuestion: content.written }
    });

    // 2. Seed Supplements (Branch Nodes)
    await prisma.supplement.deleteMany({ where: { chapterId: chapter.id } });
    for (const s of content.supplements) {
      await prisma.supplement.create({
        data: {
          title: s.title,
          link: s.link,
          type: "topic",
          chapterId: chapter.id
        }
      });
    }

    // 3. Seed Quiz
    const existingQuiz = await prisma.quiz.findFirst({ where: { chapterId: chapter.id } });
    if (existingQuiz) {
      await prisma.question.deleteMany({ where: { quizId: existingQuiz.id } });
      await prisma.quiz.delete({ where: { id: existingQuiz.id } });
    }

    const quiz = await prisma.quiz.create({
      data: {
        chapterId: chapter.id
      }
    });

    for (const q of content.quiz) {
      await prisma.question.create({
        data: {
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          quizId: quiz.id
        }
      });
    }

    console.log(`✅ ${chapter.title}: Written set, Quiz & ${content.supplements.length} Supplements added.`);
  }

  console.log('\n🚀 ALL DONE! Class 9 Math is now fully interactive with Branch Nodes, Quizzes, and Written Assessments.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
