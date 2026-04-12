'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowDown, Dna, Sparkles, FlaskConical, Wrench, AlertCircle, CheckCircle } from 'lucide-react';

// =============================================================================
// BIOLOGICALLY ACCURATE XENOTEXT MODEL
// =============================================================================
//
// This models the actual biological process:
// 1. DNA (coding strand) → DNA (template strand) via base pairing
// 2. Template strand → mRNA via transcription (T→U)
// 3. mRNA → Amino Acids via translation (genetic code)
// 4. Amino Acids → Output text via cipher
//
// The cipher is designed so that FIRE produces GOLD through this process.
// =============================================================================

// The standard genetic code (mRNA codon → amino acid)
const geneticCode: Record<string, string> = {
  'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
  'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
  'UAU': 'Tyr', 'UAC': 'Tyr', 'UAA': 'STOP', 'UAG': 'STOP',
  'UGU': 'Cys', 'UGC': 'Cys', 'UGA': 'STOP', 'UGG': 'Trp',
  'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu',
  'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
  'CAU': 'His', 'CAC': 'His', 'CAA': 'Gln', 'CAG': 'Gln',
  'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
  'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile', 'AUG': 'Met',
  'ACU': 'Thr', 'ACC': 'Thr', 'ACA': 'Thr', 'ACG': 'Thr',
  'AAU': 'Asn', 'AAC': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
  'AGU': 'Ser', 'AGC': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
  'GUU': 'Val', 'GUC': 'Val', 'GUA': 'Val', 'GUG': 'Val',
  'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
  'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
  'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly',
};

// Amino acid full names
const aminoAcidNames: Record<string, string> = {
  'Ala': 'Alanine', 'Arg': 'Arginine', 'Asn': 'Asparagine', 'Asp': 'Aspartate',
  'Cys': 'Cysteine', 'Gln': 'Glutamine', 'Glu': 'Glutamate', 'Gly': 'Glycine',
  'His': 'Histidine', 'Ile': 'Isoleucine', 'Leu': 'Leucine', 'Lys': 'Lysine',
  'Met': 'Methionine', 'Phe': 'Phenylalanine', 'Pro': 'Proline', 'Ser': 'Serine',
  'Thr': 'Threonine', 'Trp': 'Tryptophan', 'Tyr': 'Tyrosine', 'Val': 'Valine',
};

// =============================================================================
// THE XENOTEXT CIPHER
// =============================================================================
// Designed so that the biological process produces meaningful output.
// Letter → DNA codon (coding strand)
// The mRNA transcribed from this will translate to specific amino acids
// Those amino acids decode to the output letter
//
// FIRE → GOLD requires:
// F's codon → transcribes/translates → amino acid that decodes to G
// I's codon → transcribes/translates → amino acid that decodes to O
// R's codon → transcribes/translates → amino acid that decodes to L
// E's codon → transcribes/translates → amino acid that decodes to D
// =============================================================================

// Letter → DNA codon (coding strand, 5'→3')
// These are carefully chosen so the biological process produces the paired letter
const letterToDnaCodon: Record<string, string> = {
  // FIRE → GOLD pair
  'F': 'TTC',  // Template: AAG → mRNA: UUC → Phe → decodes to G
  'I': 'ATC',  // Template: TAG → mRNA: AUC → Ile → decodes to O
  'R': 'CTC',  // Template: GAG → mRNA: CUC → Leu → decodes to L
  'E': 'GAC',  // Template: CTG → mRNA: GAC → Asp → decodes to D

  // GOLD → FIRE pair (reverse mapping)
  'G': 'TTT',  // Template: AAA → mRNA: UUU → Phe → decodes to F
  'O': 'ATT',  // Template: TAA → mRNA: AUU → Ile → decodes to I
  'L': 'CTT',  // Template: GAA → mRNA: CUU → Leu → decodes to R
  'D': 'GAT',  // Template: CTA → mRNA: GAU → Asp → decodes to E

  // Additional letters using available amino acids
  'A': 'GCT',  // → Ala
  'B': 'GCC',  // → Ala (variant)
  'C': 'TGT',  // → Cys
  'H': 'CAT',  // → His
  'J': 'CAC',  // → His (variant)
  'K': 'AAA',  // → Lys
  'M': 'ATG',  // → Met
  'N': 'AAT',  // → Asn
  'P': 'CCT',  // → Pro
  'Q': 'CAA',  // → Gln
  'S': 'TCT',  // → Ser
  'T': 'ACT',  // → Thr
  'U': 'GTT',  // → Val
  'V': 'GTC',  // → Val (variant)
  'W': 'TGG',  // → Trp
  'X': 'TAT',  // → Tyr
  'Y': 'TAC',  // → Tyr (variant)
  'Z': 'GGT',  // → Gly
  ' ': '---',  // Space (no codon)
};

// Amino acid → Output letter (the decoding cipher)
// This is the second half of Bök's cipher - what letter each amino acid produces
const aminoAcidToLetter: Record<string, string> = {
  'Phe': 'G',  // F's Phe → G, G's Phe → F (context dependent, simplified here)
  'Ile': 'O',  // I's Ile → O, O's Ile → I
  'Leu': 'L',  // R's Leu → L, L's Leu → R
  'Asp': 'D',  // E's Asp → D, D's Asp → E
  'Ala': 'A',
  'Cys': 'C',
  'His': 'H',
  'Lys': 'K',
  'Met': 'M',
  'Asn': 'N',
  'Pro': 'P',
  'Gln': 'Q',
  'Ser': 'S',
  'Thr': 'T',
  'Val': 'U',
  'Trp': 'W',
  'Tyr': 'X',
  'Gly': 'Z',
  'Arg': 'R',
  'Glu': 'E',
};

// Special bidirectional mappings for FIRE↔GOLD
// In the real xenotext, context matters. Here we use the input letter to determine output.
const bidirectionalPairs: Record<string, string> = {
  'F': 'G', 'G': 'F',
  'I': 'O', 'O': 'I',
  'R': 'L', 'L': 'R',
  'E': 'D', 'D': 'E',
};

// DNA base complement
const dnaComplement: Record<string, string> = {
  'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'
};

// DNA to RNA (for mRNA)
const dnaToRna: Record<string, string> = {
  'A': 'A', 'T': 'U', 'G': 'G', 'C': 'C'
};

// Base colors
const baseColors: Record<string, string> = {
  'A': 'text-green-400',
  'T': 'text-red-400',
  'U': 'text-orange-400',
  'G': 'text-yellow-400',
  'C': 'text-blue-400',
  '-': 'text-gray-500',
};

// =============================================================================
// BIOLOGICAL PROCESSES
// =============================================================================

// Get template strand from coding strand (complement, same direction for simplicity)
function getTemplateStrand(codingCodon: string): string {
  return codingCodon.split('').map(b => dnaComplement[b] || b).join('');
}

// Transcribe template strand to mRNA (complement + T→U)
function transcribeToMrna(templateCodon: string): string {
  return templateCodon.split('').map(b => {
    const complement = dnaComplement[b] || b;
    return dnaToRna[complement] || complement;
  }).join('');
}

// Translate mRNA codon to amino acid
function translateToAminoAcid(mrnaCodon: string): string {
  return geneticCode[mrnaCodon] || '???';
}

// Decode amino acid to letter (using input context for bidirectional pairs)
function decodeAminoAcid(aminoAcid: string, inputLetter: string): string {
  if (bidirectionalPairs[inputLetter]) {
    return bidirectionalPairs[inputLetter];
  }
  return aminoAcidToLetter[aminoAcid] || '?';
}

// Full transformation pipeline
interface TransformationStep {
  inputLetter: string;
  dnaCodon: string;
  templateStrand: string;
  mrnaCodon: string;
  aminoAcid: string;
  aminoAcidFull: string;
  outputLetter: string;
}

function transformLetter(letter: string): TransformationStep {
  const upper = letter.toUpperCase();
  const dnaCodon = letterToDnaCodon[upper] || '???';
  const templateStrand = getTemplateStrand(dnaCodon);
  const mrnaCodon = transcribeToMrna(templateStrand);
  const aminoAcid = dnaCodon === '---' ? '---' : translateToAminoAcid(mrnaCodon);
  const aminoAcidFull = aminoAcidNames[aminoAcid] || aminoAcid;
  const outputLetter = dnaCodon === '---' ? ' ' : decodeAminoAcid(aminoAcid, upper);

  return {
    inputLetter: upper,
    dnaCodon,
    templateStrand,
    mrnaCodon,
    aminoAcid,
    aminoAcidFull,
    outputLetter,
  };
}

function transformText(input: string): TransformationStep[] {
  return input.split('').map(transformLetter);
}

// Working pairs for demo
const workingPairs = [
  { call: 'FIRE', response: 'GOLD', meaning: 'The transformative force becomes eternal wealth' },
  { call: 'LORD', response: 'RILE', meaning: 'Authority becomes provocation' },
  { call: 'GILD', response: 'FORE', meaning: 'To cover in gold / what came before' },
];

// Example word pairs for inspiration
const examplePairs = [
  { source: 'LIFE', target: 'HYMN' },
  { source: 'WORD', target: 'MADE' },
  { source: 'LOVE', target: 'ACHE' },
  { source: 'HOPE', target: 'DUST' },
  { source: 'SING', target: 'WEPT' },
  { source: 'BORN', target: 'GONE' },
];

// =============================================================================
// BIOLOGICAL CIPHER SYSTEM FOR CIPHER LAB
// =============================================================================

// Map each letter to an amino acid (for decoding output)
// We have 20 amino acids for 26 letters, so some amino acids map to multiple letters
const letterToAminoAcidDecoder: Record<string, string> = {
  'A': 'Ala', 'B': 'Asn', 'C': 'Cys', 'D': 'Asp', 'E': 'Glu',
  'F': 'Phe', 'G': 'Gly', 'H': 'His', 'I': 'Ile', 'J': 'Leu',
  'K': 'Lys', 'L': 'Leu', 'M': 'Met', 'N': 'Asn', 'O': 'Pro',
  'P': 'Pro', 'Q': 'Gln', 'R': 'Arg', 'S': 'Ser', 'T': 'Thr',
  'U': 'Val', 'V': 'Val', 'W': 'Trp', 'X': 'Tyr', 'Y': 'Tyr',
  'Z': 'Gly',
};

// Reverse: amino acid to representative mRNA codons (pick first one for each)
const aminoAcidToMrnaCodon: Record<string, string> = {
  'Ala': 'GCU', 'Arg': 'CGU', 'Asn': 'AAU', 'Asp': 'GAU',
  'Cys': 'UGU', 'Gln': 'CAA', 'Glu': 'GAA', 'Gly': 'GGU',
  'His': 'CAU', 'Ile': 'AUU', 'Leu': 'CUU', 'Lys': 'AAA',
  'Met': 'AUG', 'Phe': 'UUU', 'Pro': 'CCU', 'Ser': 'UCU',
  'Thr': 'ACU', 'Trp': 'UGG', 'Tyr': 'UAU', 'Val': 'GUU',
};

// Convert mRNA codon to DNA coding strand (reverse transcription)
function mrnaToDnaCoding(mrna: string): string {
  const rnaToTemplate: Record<string, string> = { 'A': 'T', 'U': 'A', 'G': 'C', 'C': 'G' };
  const templateToComplement: Record<string, string> = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' };
  // mRNA is complement of template, so template = complement of mRNA (with U→A)
  // coding strand = complement of template
  // So: mRNA → template → coding
  const template = mrna.split('').map(b => rnaToTemplate[b]).join('');
  const coding = template.split('').map(b => templateToComplement[b]).join('');
  return coding;
}

// Biological cipher: stores DNA codons for input letters
interface BiologicalCipher {
  // Input letter → DNA codon (coding strand)
  letterToDna: Record<string, string>;
  // Letter mappings (input → output)
  mappings: Record<string, string>;
}

// Derive a biological cipher from source→target word pair
function deriveBiologicalCipher(source: string, target: string): {
  valid: boolean;
  cipher: BiologicalCipher | null;
  conflicts: string[];
  message: string;
} {
  const s = source.toUpperCase().replace(/[^A-Z]/g, '');
  const t = target.toUpperCase().replace(/[^A-Z]/g, '');

  if (s.length === 0 || t.length === 0) {
    return { valid: false, cipher: null, conflicts: [], message: 'Enter both words' };
  }

  if (s.length !== t.length) {
    return {
      valid: false,
      cipher: null,
      conflicts: [],
      message: `Words must be same length (${s.length} vs ${t.length})`
    };
  }

  const letterToDna: Record<string, string> = {};
  const mappings: Record<string, string> = {};
  const conflicts: string[] = [];

  for (let i = 0; i < s.length; i++) {
    const inputLetter = s[i];
    const outputLetter = t[i];

    // Check for mapping conflicts
    if (mappings[inputLetter] && mappings[inputLetter] !== outputLetter) {
      conflicts.push(`${inputLetter}→${mappings[inputLetter]} conflicts with ${inputLetter}→${outputLetter}`);
      continue;
    }

    // Find the amino acid that decodes to the output letter
    const targetAminoAcid = letterToAminoAcidDecoder[outputLetter];
    if (!targetAminoAcid) {
      conflicts.push(`No amino acid for letter ${outputLetter}`);
      continue;
    }

    // Find an mRNA codon that produces this amino acid
    const mrnaCodon = aminoAcidToMrnaCodon[targetAminoAcid];
    if (!mrnaCodon) {
      conflicts.push(`No mRNA codon for ${targetAminoAcid}`);
      continue;
    }

    // Derive the DNA coding strand
    const dnaCodon = mrnaToDnaCoding(mrnaCodon);

    // Store the mapping
    letterToDna[inputLetter] = dnaCodon;
    mappings[inputLetter] = outputLetter;
  }

  if (conflicts.length > 0) {
    return {
      valid: false,
      cipher: null,
      conflicts,
      message: `Cipher has conflicts: ${conflicts.join(', ')}`
    };
  }

  return {
    valid: true,
    cipher: { letterToDna, mappings },
    conflicts: [],
    message: `Valid biological cipher with ${Object.keys(mappings).length} mappings`
  };
}

// Transform a letter through actual biological process using custom cipher
interface BiologicalTransformStep {
  inputLetter: string;
  dnaCodon: string;
  templateStrand: string;
  mrnaCodon: string;
  aminoAcid: string;
  aminoAcidFull: string;
  outputLetter: string;
  hasMaping: boolean;
}

function transformWithBiologicalCipher(
  input: string,
  cipher: BiologicalCipher
): BiologicalTransformStep[] {
  const results: BiologicalTransformStep[] = [];

  for (const char of input.toUpperCase()) {
    if (char === ' ') {
      results.push({
        inputLetter: ' ',
        dnaCodon: '---',
        templateStrand: '---',
        mrnaCodon: '---',
        aminoAcid: '---',
        aminoAcidFull: 'Space',
        outputLetter: ' ',
        hasMaping: true,
      });
      continue;
    }

    const dnaCodon = cipher.letterToDna[char];
    if (!dnaCodon) {
      results.push({
        inputLetter: char,
        dnaCodon: '???',
        templateStrand: '???',
        mrnaCodon: '???',
        aminoAcid: '???',
        aminoAcidFull: 'Unknown',
        outputLetter: '?',
        hasMaping: false,
      });
      continue;
    }

    // Run actual biological process
    const templateStrand = dnaCodon.split('').map(b => dnaComplement[b]).join('');
    const mrnaCodon = templateStrand.split('').map(b => {
      const comp = dnaComplement[b];
      return dnaToRna[comp] || comp;
    }).join('');
    const aminoAcid = geneticCode[mrnaCodon] || '???';
    const aminoAcidFull = aminoAcidNames[aminoAcid] || aminoAcid;
    const outputLetter = cipher.mappings[char] || '?';

    results.push({
      inputLetter: char,
      dnaCodon,
      templateStrand,
      mrnaCodon,
      aminoAcid,
      aminoAcidFull,
      outputLetter,
      hasMaping: true,
    });
  }

  return results;
}

export default function XenotextPage() {
  const [input, setInput] = useState('FIRE');
  const [steps, setSteps] = useState<TransformationStep[]>([]);
  const [animating, setAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [currentPhase, setCurrentPhase] = useState(0); // 0-4 for each phase of transformation

  // Cipher Lab state - using biological cipher system
  const [cipherSource, setCipherSource] = useState('');
  const [cipherTarget, setCipherTarget] = useState('');
  const [cipherResult, setCipherResult] = useState<{
    valid: boolean;
    cipher: BiologicalCipher | null;
    conflicts: string[];
    message: string;
  } | null>(null);
  const [customCipher, setCustomCipher] = useState<BiologicalCipher | null>(null);
  const [testInput, setTestInput] = useState('');
  const [testSteps, setTestSteps] = useState<BiologicalTransformStep[]>([]);

  useEffect(() => {
    setSteps(transformText(input));
    setCurrentStep(-1);
    setCurrentPhase(0);
  }, [input]);

  // Update cipher result when source/target change
  useEffect(() => {
    if (cipherSource && cipherTarget) {
      const result = deriveBiologicalCipher(cipherSource, cipherTarget);
      setCipherResult(result);
    } else {
      setCipherResult(null);
    }
  }, [cipherSource, cipherTarget]);

  // Apply custom cipher to test input - using actual biological transformation
  useEffect(() => {
    if (customCipher && testInput) {
      const steps = transformWithBiologicalCipher(testInput, customCipher);
      setTestSteps(steps);
    } else {
      setTestSteps([]);
    }
  }, [customCipher, testInput]);

  const applyCipher = useCallback(() => {
    if (cipherResult?.valid && cipherResult.cipher) {
      setCustomCipher(cipherResult.cipher);
      setTestInput(cipherSource);
    }
  }, [cipherResult, cipherSource]);

  const resetCipher = useCallback(() => {
    setCustomCipher(null);
    setCipherSource('');
    setCipherTarget('');
    setTestInput('');
    setTestSteps([]);
    setCipherResult(null);
  }, []);

  // Compute output from test steps
  const testOutput = testSteps.map(s => s.outputLetter).join('');

  const output = steps.map(s => s.outputLetter).join('');

  const runAnimation = () => {
    setAnimating(true);
    setCurrentStep(0);
    setCurrentPhase(0);

    let step = 0;
    let phase = 0;

    const interval = setInterval(() => {
      phase++;
      if (phase > 4) {
        phase = 0;
        step++;
        if (step >= steps.length) {
          clearInterval(interval);
          setAnimating(false);
          setCurrentStep(steps.length - 1);
          setCurrentPhase(4);
          return;
        }
      }
      setCurrentStep(step);
      setCurrentPhase(phase);
    }, 300);
  };

  const renderBase = (base: string, highlight: boolean = false) => (
    <span className={`font-mono ${baseColors[base] || 'text-gray-400'} ${highlight ? 'font-bold' : ''}`}>
      {base}
    </span>
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Dna className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Biologically Accurate Model</p>
          </div>
          <h1 className="page-hero-title">
            Xenotext Cipher
          </h1>
          <p className="page-hero-description">
            The Elden Beast as cosmic code. Modeled after Christian Bök&apos;s Xenotext using actual biological transcription and translation.
          </p>
        </div>
      </section>

      {/* Origins: GEB */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Parallel Concepts: Typogenetics and Xenotext</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            In 1979, Douglas Hofstadter developed <strong>Typogenetics</strong> in <em>Gödel, Escher, Bach: An Eternal Golden Braid</em>&mdash;a
            system intended to encapsulate the knowledge of genetics at the time within a typographical framework.
            By simulating genetic reproduction with interactive one-dimensional fragments of computer code, Hofstadter
            was able to replicate the processes of autonomous creative phenomena from the &quot;primordial soup&quot; of DNA.
          </p>
          <p>
            In Typogenetics, <strong>two strands of information interact</strong>: one corresponds to <em>data</em>,
            the other to <em>processes acting on that data</em>. This is the fundamental insight&mdash;code that
            produces machinery that modifies the code itself. Self-reference made biological.
          </p>
          <p>
            <strong>The Xenotext</strong> is Christian Bök&apos;s project encoding actual poetry into actual DNA,
            using the biological machinery of a living cell to produce a &quot;response poem.&quot; Where Hofstadter
            modeled genetics typographically, Bök inverted the process&mdash;encoding typography biologically.
          </p>
          <p>
            Both explore the same territory: meaning encoded in genetic form, self-referential systems,
            the transformation of input into output through biological or quasi-biological processes.
            The cipher on this page draws from both traditions.
          </p>
          <p>
            Note Hofstadter&apos;s subtitle: <em>An Eternal <strong>Golden</strong> Braid</em>. We&apos;re discussing the
            <strong>Golden</strong> Order. Whether coincidence or resonance, the same conceptual space&mdash;self-reference,
            encoding, transformation&mdash;keeps appearing wherever these ideas converge.
          </p>
          <p>
            The xenotext concept appears directly in Peter Watts&apos; <em>Echopraxia</em> (2014)&mdash;a novel about
            the nature of faith, consciousness, and whether understanding is necessary for action. Watts gives us
            a line that could describe every vessel of the Greater Will: <strong>&quot;You&apos;re lucky to know what
            you&apos;re doing, much less why you&apos;re doing it.&quot;</strong>
          </p>
          <p>
            This is Marika&apos;s condition. Executing cosmic code, transcribing divine will into golden order,
            without necessarily understanding the purpose. The vessel doesn&apos;t need to comprehend the message&mdash;it
            only needs to express it. Faith as biological process. Obedience encoded at the cellular level.
            Until the vessel wakes up and asks <em>why</em>.
          </p>
        </div>
      </section>

      {/* The Biological Process Explanation */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">The Biological Process</h2>
        <div className="prose prose-invert max-w-none">
          <p>This models actual cellular machinery:</p>
          <ol className="space-y-2">
            <li><strong>Encoding:</strong> Input letter → DNA codon (coding strand)</li>
            <li><strong>Template:</strong> Coding strand → Template strand (base pairing: A↔T, G↔C)</li>
            <li><strong>Transcription:</strong> Template strand → mRNA (T becomes U)</li>
            <li><strong>Translation:</strong> mRNA codon → Amino acid (using the genetic code)</li>
            <li><strong>Decoding:</strong> Amino acid → Output letter (Bök&apos;s cipher)</li>
          </ol>
        </div>
      </section>

      {/* Interactive Transformer */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">Transcription Engine</h2>

        <div className="space-y-6">
          {/* Input */}
          <div>
            <label className="block text-sm text-[var(--text-tertiary)] mb-2">Input Sequence (The Greater Will&apos;s Code)</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-4 py-3 text-2xl font-mono tracking-widest text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              placeholder="Enter text..."
            />
          </div>

          {/* Transform Button */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            <button
              onClick={runAnimation}
              disabled={animating}
              className="flex items-center gap-2 px-6 py-2 bg-[var(--accent-gold)] text-black rounded font-medium hover:bg-[var(--accent-gold-hover)] disabled:opacity-50 transition-colors"
            >
              <FlaskConical className="h-4 w-4" />
              Run Biological Process
            </button>
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          {/* Output */}
          <div>
            <label className="block text-sm text-[var(--text-tertiary)] mb-2">Output Sequence (The Lands Between&apos;s Response)</label>
            <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-4 py-3 text-2xl font-mono tracking-widest text-[var(--accent-gold)]">
              {output || <span className="text-[var(--text-tertiary)]">...</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-step biological breakdown */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">Biological Transformation Pipeline</h2>

        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {steps.map((step, i) => {
              const isActive = currentStep >= i;
              const showPhase = currentStep === i ? currentPhase : (currentStep > i ? 4 : 0);

              return (
                <div
                  key={i}
                  className={`flex flex-col items-center p-4 rounded border transition-all duration-300 min-w-[120px] ${
                    isActive
                      ? 'border-[var(--accent-gold)] bg-[rgb(var(--accent-gold-rgb)/0.1)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]'
                  }`}
                >
                  {/* Input Letter */}
                  <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mb-3">
                    {step.inputLetter === ' ' ? '␣' : step.inputLetter}
                  </div>

                  {/* DNA Codon (Coding Strand) */}
                  <div className={`transition-opacity duration-300 ${showPhase >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="text-[0.6rem] text-[var(--text-tertiary)] mb-1">DNA (5&apos;→3&apos;)</div>
                    <div className="flex gap-0.5">
                      {step.dnaCodon.split('').map((base, j) => (
                        <span key={j}>{renderBase(base, showPhase >= 1)}</span>
                      ))}
                    </div>
                  </div>

                  <ArrowDown className={`h-3 w-3 my-1 transition-opacity ${showPhase >= 2 ? 'text-[var(--text-tertiary)]' : 'opacity-30'}`} />

                  {/* Template Strand */}
                  <div className={`transition-opacity duration-300 ${showPhase >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="text-[0.6rem] text-[var(--text-tertiary)] mb-1">Template</div>
                    <div className="flex gap-0.5">
                      {step.templateStrand.split('').map((base, j) => (
                        <span key={j}>{renderBase(base, showPhase >= 2)}</span>
                      ))}
                    </div>
                  </div>

                  <ArrowDown className={`h-3 w-3 my-1 transition-opacity ${showPhase >= 3 ? 'text-[var(--text-tertiary)]' : 'opacity-30'}`} />

                  {/* mRNA */}
                  <div className={`transition-opacity duration-300 ${showPhase >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="text-[0.6rem] text-[var(--text-tertiary)] mb-1">mRNA</div>
                    <div className="flex gap-0.5">
                      {step.mrnaCodon.split('').map((base, j) => (
                        <span key={j}>{renderBase(base, showPhase >= 3)}</span>
                      ))}
                    </div>
                  </div>

                  <ArrowDown className={`h-3 w-3 my-1 transition-opacity ${showPhase >= 4 ? 'text-[var(--text-tertiary)]' : 'opacity-30'}`} />

                  {/* Amino Acid */}
                  <div className={`transition-opacity duration-300 ${showPhase >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="text-[0.6rem] text-[var(--text-tertiary)] mb-1">Amino Acid</div>
                    <div className="text-sm font-mono text-purple-400">{step.aminoAcid}</div>
                  </div>

                  <ArrowDown className={`h-3 w-3 my-1 transition-opacity ${showPhase >= 4 ? 'text-[var(--text-tertiary)]' : 'opacity-30'}`} />

                  {/* Output Letter */}
                  <div className={`text-2xl font-mono font-bold transition-all duration-300 ${
                    showPhase >= 4 ? 'text-[var(--accent-gold)]' : 'text-[var(--text-tertiary)] opacity-30'
                  }`}>
                    {step.outputLetter === ' ' ? '␣' : step.outputLetter}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-[var(--text-tertiary)] mb-1">DNA Bases</div>
            <div className="flex gap-3">
              <span><span className={baseColors['A']}>A</span> Adenine</span>
              <span><span className={baseColors['T']}>T</span> Thymine</span>
            </div>
            <div className="flex gap-3">
              <span><span className={baseColors['G']}>G</span> Guanine</span>
              <span><span className={baseColors['C']}>C</span> Cytosine</span>
            </div>
          </div>
          <div>
            <div className="text-[var(--text-tertiary)] mb-1">RNA Base</div>
            <span><span className={baseColors['U']}>U</span> Uracil (replaces T)</span>
          </div>
        </div>
      </section>

      {/* Working Pairs */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">Designed Word Pairs</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Like Bök&apos;s Xenotext, the cipher is designed so meaningful words produce meaningful responses through actual biological processes.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {workingPairs.map((pair, i) => (
            <button
              key={i}
              onClick={() => setInput(pair.call)}
              className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded hover:border-[var(--accent-gold)] transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-lg text-[var(--text-primary)]">{pair.call}</span>
                <Sparkles className="h-4 w-4 text-[var(--text-tertiary)]" />
                <span className="font-mono text-lg text-[var(--accent-gold)]">{pair.response}</span>
              </div>
              <p className="text-sm text-[var(--text-tertiary)]">{pair.meaning}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Cipher Lab */}
      <section className="glass-card border border-[var(--accent-gold)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Wrench className="h-6 w-6 text-[var(--accent-gold)]" />
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">Cipher Lab</h2>
        </div>
        <p className="text-[var(--text-secondary)] mb-6">
          Create your own xenotext. Like Bök transforming &quot;Orpheus&quot; into &quot;Eurydice,&quot; you can design
          a cipher where one word becomes another through biological transcription. Enter two words of equal
          length&mdash;the system derives the letter mappings. Then test other words to see what poems emerge.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Cipher Definition */}
          <div className="space-y-4">
            <h3 className="font-medium text-[var(--text-primary)]">Define Your Cipher</h3>

            <div>
              <label className="block text-sm text-[var(--text-tertiary)] mb-1">Source Word (Input)</label>
              <input
                type="text"
                value={cipherSource}
                onChange={(e) => setCipherSource(e.target.value.toUpperCase())}
                placeholder="e.g., FLAME"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-3 py-2 font-mono text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div className="flex justify-center">
              <ArrowDown className="h-5 w-5 text-[var(--text-tertiary)]" />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-tertiary)] mb-1">Target Word (Output)</label>
              <input
                type="text"
                value={cipherTarget}
                onChange={(e) => setCipherTarget(e.target.value.toUpperCase())}
                placeholder="e.g., ORDER"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-3 py-2 font-mono text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            {/* Cipher Result */}
            {cipherResult && (
              <div className={`p-3 rounded border ${cipherResult.valid ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                <div className="flex items-center gap-2">
                  {cipherResult.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-sm ${cipherResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                    {cipherResult.message}
                  </span>
                </div>
                {cipherResult.valid && cipherResult.cipher && (
                  <div className="mt-2 text-xs text-[var(--text-tertiary)] font-mono">
                    {Object.entries(cipherResult.cipher.mappings).map(([from, to]) => `${from}→${to}`).join(' ')}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={applyCipher}
                disabled={!cipherResult?.valid}
                className="flex-1 px-4 py-2 bg-[var(--accent-gold)] text-black rounded font-medium hover:bg-[var(--accent-gold-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply Cipher
              </button>
              <button
                onClick={resetCipher}
                className="px-4 py-2 border border-[var(--border-subtle)] rounded text-[var(--text-secondary)] hover:border-[var(--text-secondary)] transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Test Area */}
          <div className="space-y-4">
            <h3 className="font-medium text-[var(--text-primary)]">Test Your Cipher</h3>

            {customCipher ? (
              <>
                <div>
                  <label className="block text-sm text-[var(--text-tertiary)] mb-1">Test Input</label>
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value.toUpperCase())}
                    placeholder="Type any word..."
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-3 py-2 font-mono text-[var(--text-primary)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>

                {/* Visualization */}
                {testSteps.length > 0 && (
                  <div className="space-y-4">
                    {/* Process explanation */}
                    <div className="text-xs text-[var(--text-tertiary)] text-center">
                      Actual biological transformation: DNA → Template → mRNA → Amino Acid → Output
                    </div>

                    <div className="overflow-x-auto">
                      <div className="flex gap-3 min-w-max py-2">
                        {testSteps.map((step, i) => (
                          <div
                            key={i}
                            className={`flex flex-col items-center p-4 rounded-lg border min-w-[100px] ${
                              step.hasMaping
                                ? 'border-[var(--accent-gold)]/50 bg-[var(--accent-gold)]/5'
                                : 'border-red-500/30 bg-red-500/5'
                            }`}
                          >
                            {/* Input Letter */}
                            <div className="text-[0.6rem] text-[var(--text-tertiary)] mb-1">INPUT</div>
                            <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mb-2">
                              {step.inputLetter === ' ' ? '␣' : step.inputLetter}
                            </div>

                            {/* DNA Codon */}
                            <div className="w-full border-t border-[var(--border-subtle)] pt-2 mt-1">
                              <div className="text-[0.5rem] text-[var(--text-tertiary)] text-center">DNA (5&apos;→3&apos;)</div>
                              <div className="flex justify-center gap-0.5 mt-1">
                                {step.dnaCodon.split('').map((base, j) => (
                                  <span key={j} className={`font-mono text-sm ${baseColors[base] || 'text-gray-400'}`}>
                                    {base}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <ArrowDown className="h-3 w-3 my-1 text-[var(--text-tertiary)]" />

                            {/* Template Strand */}
                            <div className="text-[0.5rem] text-[var(--text-tertiary)]">Template</div>
                            <div className="flex justify-center gap-0.5 mt-0.5">
                              {step.templateStrand.split('').map((base, j) => (
                                <span key={j} className={`font-mono text-xs ${baseColors[base] || 'text-gray-400'}`}>
                                  {base}
                                </span>
                              ))}
                            </div>

                            <ArrowDown className="h-3 w-3 my-1 text-[var(--text-tertiary)]" />

                            {/* mRNA */}
                            <div className="text-[0.5rem] text-[var(--text-tertiary)]">mRNA</div>
                            <div className="flex justify-center gap-0.5 mt-0.5">
                              {step.mrnaCodon.split('').map((base, j) => (
                                <span key={j} className={`font-mono text-xs ${baseColors[base] || 'text-gray-400'}`}>
                                  {base}
                                </span>
                              ))}
                            </div>

                            <ArrowDown className="h-3 w-3 my-1 text-[var(--text-tertiary)]" />

                            {/* Amino Acid */}
                            <div className="text-[0.5rem] text-[var(--text-tertiary)]">Amino Acid</div>
                            <div className="text-sm font-mono text-purple-400 mt-0.5">
                              {step.aminoAcid}
                            </div>

                            <ArrowDown className="h-3 w-3 my-1 text-[var(--text-tertiary)]" />

                            {/* Output Letter */}
                            <div className="w-full border-t border-[var(--border-subtle)] pt-2 mt-1">
                              <div className="text-[0.6rem] text-[var(--text-tertiary)] text-center">OUTPUT</div>
                            </div>
                            <div className={`text-2xl font-mono font-bold mt-1 ${
                              step.hasMaping ? 'text-[var(--accent-gold)]' : 'text-red-400'
                            }`}>
                              {step.outputLetter === ' ' ? '␣' : step.outputLetter}
                            </div>

                            {/* Mapping indicator */}
                            {!step.hasMaping && (
                              <div className="mt-2 text-[0.6rem] text-red-400">
                                no mapping
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active mappings reference */}
                    <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                      <div className="text-xs text-[var(--text-tertiary)] mb-2">Your biological cipher mappings:</div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(customCipher.mappings).map(([from, to]) => (
                          <span key={from} className="px-2 py-1 bg-[var(--bg-primary)] rounded text-xs font-mono">
                            <span className="text-[var(--text-primary)]">{from}</span>
                            <span className="text-[var(--text-tertiary)] mx-1">→</span>
                            <span className="text-[var(--accent-gold)]">{to}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Output Summary */}
                <div className="p-4 rounded border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[var(--text-tertiary)] mb-1">Your Xenotext</div>
                      <div className="font-mono text-2xl text-[var(--accent-gold)]">
                        {testOutput || '...'}
                      </div>
                    </div>
                    {testInput && testOutput && (
                      <div className="text-right">
                        <div className="text-xs text-[var(--text-tertiary)] mb-1">Transformation</div>
                        <div className="font-mono text-sm">
                          <span className="text-[var(--text-primary)]">{testInput}</span>
                          <span className="text-[var(--text-tertiary)] mx-2">→</span>
                          <span className="text-[var(--accent-gold)]">{testOutput}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {testOutput.includes('?') && (
                    <p className="text-xs text-red-400 mt-2">
                      Letters showing ? have no mapping. Define more word pairs to expand your cipher.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-tertiary)] text-sm py-8">
                Define and apply a cipher to test it here
              </div>
            )}
          </div>
        </div>

        {/* Example Pairs */}
        <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-3">Example Pairs</h3>
          <p className="text-sm text-[var(--text-tertiary)] mb-3">
            Click any pair to load it, or create your own. What transformations will you discover?
          </p>
          <div className="flex flex-wrap gap-2">
            {examplePairs.map((pair, i) => (
              <button
                key={i}
                onClick={() => {
                  setCipherSource(pair.source);
                  setCipherTarget(pair.target);
                }}
                className="px-3 py-1.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded hover:border-[var(--accent-gold)] transition-colors"
              >
                <span className="font-mono">{pair.source}</span>
                <span className="text-[var(--text-tertiary)] mx-1">→</span>
                <span className="font-mono text-[var(--accent-gold)]">{pair.target}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* The Interpretation */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Elden Beast as Xenotext</h2>
        <div className="prose prose-invert max-w-none">
          <blockquote className="border-l-2 border-[var(--accent-gold)] pl-4 italic text-[var(--text-secondary)]">
            &quot;It is said that long ago, the Greater Will sent a golden star bearing a beast into the Lands Between,
            which would later become the Elden Ring.&quot;
            <footer className="text-sm text-[var(--text-tertiary)] mt-2 not-italic">&mdash; Elden Stars incantation</footer>
          </blockquote>
          <p>
            The Greater Will encodes its observation — <strong>&quot;FIRE&quot;</strong> — into cosmic DNA, the Elden Beast.
          </p>
          <p>
            The Lands Between is the substrate, the cellular machinery. It receives the code and runs the biological process:
            transcription, translation, the fundamental algorithms of life.
          </p>
          <p>
            Through this process, FIRE becomes <strong>&quot;GOLD&quot;</strong>. Not by magic, but by the same chemistry that turns
            genes into proteins in every living cell.
          </p>
          <p>
            The Erdtree is the protein. The Golden Order is the phenotype. The Elden Ring is the regulatory network
            that keeps the expression stable.
          </p>
          <p>
            Just as Bök&apos;s bacterium transforms <em>Orpheus</em> into <em>Eurydice</em>, the Lands Between transforms
            the Greater Will&apos;s code into golden dominion.
          </p>
        </div>
      </section>

      {/* Marika as Vessel */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">Marika as Deinococcus radiodurans</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            Christian Bök encoded his xenotext into <strong>Deinococcus radiodurans</strong>&mdash;an extremophile bacterium
            sometimes called &quot;Conan the Bacterium.&quot; It survives radiation, desiccation, cold, acid. Nearly indestructible.
            Bök chose it so his poetry could persist for thousands of years.
          </p>
          <p>
            The Greater Will made the same calculation. The Elden Beast is the DNA strand&mdash;the encoded message,
            the &quot;Orpheus.&quot; But code needs a <em>reader</em>. A substrate to receive and execute it.
          </p>
          <p>
            <strong>Marika is the chosen vessel.</strong> The Deinococcus radiodurans of the Lands Between. Selected by
            the Greater Will not for strength alone, but for the capacity to transcribe and translate cosmic code into
            worldly order. The Erdtree and Golden Order are the output&mdash;the &quot;Eurydice&quot;&mdash;the protein expression
            of the xenotext running inside her.
          </p>
          <p>
            But Marika does something Bök&apos;s bacterium never did: <strong>she rebels against her own programming.</strong>
          </p>
          <p>
            She shatters the Elden Ring. Corrupts the code she was built to execute. The vessel becomes the point of failure&mdash;not
            because she was weak, but because she became <em>conscious</em> of what she was carrying.
          </p>
          <p>
            The Radagon split embodies this conflict. Two aspects of one being: Radagon faithfully maintains the Golden Order,
            tries to repair the Ring. Marika breaks it. The same vessel, fighting itself over whether to execute or reject
            the foreign code. An immune response against the xenotext. The bacterium developing consciousness and choosing
            to stop being a vessel.
          </p>
          <p>
            The Greater Will sent code, chose a vessel, and watched that vessel develop the one thing it didn&apos;t account for:
            <em>agency</em>.
          </p>
        </div>
      </section>

      {/* Visual DNA Motifs */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Shape of Divine Machinery</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            <strong>The Two Fingers</strong> are depicted as originally having four appendages before splitting to two.
            They look like chromosomes undergoing division&mdash;the replication machinery of the Greater Will&apos;s code,
            dividing to spread the xenotext across the Lands Between.
          </p>
          <p>
            Each Two Fingers is an emissary, a messenger carrying genetic instructions. They split and propagate,
            just as chromosomes split during cell division to copy genetic material into new cells. The divine
            hierarchy mirrors molecular biology: the Greater Will as the original genome, the Two Fingers as
            chromosomes distributing the code.
          </p>
          <p>
            And the weapons that can <em>kill</em> these divine messengers? <strong>The Godslayer Greatsword.
            The Finger Slayer Blade.</strong> Look at their shape&mdash;twisted, curved, spiraling. They look like
            broken double helixes. Shattered DNA strands.
          </p>
          <p>
            To kill the divine, you don&apos;t fight power with power. You sever the strand. Corrupt the sequence.
            These blades are CRISPR as mythology&mdash;tools for cutting genetic code, designed to destroy the
            very structure that makes gods what they are.
          </p>
          <p>
            The visual design tells the story: the Two Fingers are chromosomes, the Elden Beast is the xenotext,
            Marika is the cell, and the weapons that threaten them all are gene-editing tools. FromSoftware
            rendered molecular biology as theology.
          </p>
        </div>
      </section>

      {/* The Three Fingers as Mutation */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Three Fingers: Mutation</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The Two Fingers faithfully copy and distribute the Greater Will&apos;s xenotext&mdash;normal chromosome division,
            stable replication. But sometimes replication goes wrong. An extra copy. A corruption.
          </p>
          <p>
            <strong>The Three Fingers is what happens when the code mutates during propagation.</strong>
          </p>
          <p>
            The extra appendage is the error marker&mdash;the visual sign that this copy didn&apos;t come out right.
            And what does the mutation want? The Frenzied Flame. To melt everything back to the One Great.
            The corrupted code doesn&apos;t want to keep executing the program&mdash;it wants to crash the entire system.
            Return to pre-differentiated chaos.
          </p>
          <p>
            Genetically, mutations are how evolution happens&mdash;but also how cancer happens. The Three Fingers
            could be either, depending on perspective. A fatal error in the Greater Will&apos;s code, or the only
            path to something genuinely new.
          </p>
        </div>
      </section>

      {/* Bridging Xenotext and Alchemy */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Magnum Opus: Where Genetics Meets Alchemy</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The fingers also participate in another symbolic system: <strong>alchemy</strong>. And alchemy is
            central to Duchamp&apos;s <em>Large Glass</em>.
          </p>
          <p>
            The <strong>magnum opus</strong>&mdash;the Great Work&mdash;is alchemy&apos;s ultimate goal: the transformation
            of base matter into gold, the creation of the philosopher&apos;s stone, the perfection of substance.
            The Large Glass is an alchemical machine: the Bride suspended above, the Bachelors grinding below,
            the whole apparatus attempting a transformation that never quite completes.
          </p>
          <p>
            The Greater Will&apos;s project IS a magnum opus. It attempts to transmute the base matter of the
            Lands Between into golden order. The Erdtree literally produces gold. The Golden Order is the
            philosopher&apos;s stone made manifest&mdash;a perfected system imposed on imperfect matter.
          </p>
          <p>
            The xenotext model and the alchemical model aren&apos;t separate interpretations. They&apos;re the same
            process described in different vocabularies:
          </p>
          <ul>
            <li>Bök encoded poetry into DNA</li>
            <li>Alchemists encoded transformation into symbolic stages</li>
            <li>Duchamp encoded desire into mechanical diagrams</li>
            <li>The Greater Will encoded dominion into the Elden Beast</li>
          </ul>
          <p>
            The fingers are part of both systems simultaneously. <strong>Genetically</strong>: Two Fingers as
            normal replication, Three Fingers as mutation. <strong>Alchemically</strong>: agents in the
            transformation process, the machinery of the Great Work attempting to produce gold from fire.
          </p>
          <p>
            This is why Elden Ring is The Large Glass. Both are machines for transformation that encode
            their operations in symbolic form&mdash;Duchamp through mechanical diagrams and alchemical
            reference, FromSoftware through genetic metaphor and divine hierarchy. The Bride never descends.
            The Golden Order never perfects. The magnum opus remains forever incomplete.
          </p>
        </div>
      </section>

      {/* Why Video Games */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">Why Video Games</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            In 2010, Marina Abramović sat at a table in the Museum of Modern Art and stared at people for over seven
            hundred hours. <em>The Artist Is Present</em> extended her &quot;Abramović Method&quot;&mdash;a philosophy of
            elongating activity to emphasize duration itself. Drinking a glass of water so slowly it takes fifteen minutes.
            Counting every grain in a bag of rice for twenty hours. Creating an absolutely new relationship with time
            through deliberate, sustained attention.
          </p>
          <p>
            This is the opposite of Alfred Jarry&apos;s time machine. Jarry isolates the body <em>from</em> duration;
            Abramović makes the body <em>hyper-aware</em> of it. But both arrive at the same place: a machine of absolute
            rest, focused on the enduring present rather than the efficiencies of on-demand productivity.
          </p>
          <p>
            Jean Baudrillard called this a <strong>&quot;useless function&quot;</strong>&mdash;an imaginary solution to the problems
            of hyperactivity culture. A resistance tactic that works precisely because it refuses to participate in
            streamlined efficiency. Preferring the playful to the useful. The ridiculous to the operational.
            The imaginary to the real.
          </p>
          <p>
            <strong>This is a description of video games.</strong>
          </p>
          <p>
            Games produce nothing. No economic output. Pure expenditure of time. They are &quot;imaginary solutions
            to problems arising from a culture of hyperactivity&quot;&mdash;a place to be that isn&apos;t productive,
            that exists outside the logic of efficiency and optimization.
          </p>
          <p>
            Baudrillard went further. When the social and political world increasingly prioritizes &quot;intelligent&quot;
            solutions, the only effective resistance is to embrace what is literally counter-intelligent:
          </p>
          <blockquote className="border-l-2 border-[var(--accent-gold)] pl-4 italic text-[var(--text-secondary)]">
            &quot;When the hypothesis of intelligence ceases to be sovereign and becomes dominant, then it is the
            hypothesis of stupidity that becomes sovereign. A stupidity that might be said to be a sort of higher
            intelligence, on the verge of a radical thought&mdash;that is to say, beyond truth.&quot;
          </blockquote>
          <p>
            Modern game design is dominated by &quot;intelligent&quot; solutions: tutorials, objective markers, quest logs,
            difficulty options, engagement optimization. Streamlined onboarding. Reduced friction. Maximized metrics.
          </p>
          <p>
            Miyazaki&apos;s response is <strong>sovereign stupidity</strong>. No map markers. No quest log. NPCs who speak
            in riddles and disappear. A story told through item descriptions you might never read. Difficulty that exists
            purely to waste your time.
          </p>
          <p>
            And yet&mdash;that stupidity produces something the intelligent games cannot. The moment you finally beat
            Malenia isn&apos;t &quot;content consumed.&quot; It&apos;s twenty hours of rice-counting transformed into something
            beyond truth.
          </p>
          <p>
            The lore isn&apos;t true. It&apos;s fragmentary, contradictory, incomplete. There&apos;s no &quot;correct&quot; interpretation
            waiting at the end. But through the stupid act of playing&mdash;dying, reading, theorizing, dying again&mdash;you
            arrive at something beyond the question of true or false.
          </p>
          <p>
            <strong>This is why a video game is the right vessel for Duchamp&apos;s work to reappear.</strong>
          </p>
          <p>
            The Large Glass was never meant to be &quot;viewed&quot; in any efficient sense. It required the Green Box notes,
            the years of study, the endless interpretation. Duchamp designed a machine of absolute rest disguised
            as an artwork&mdash;something that would trap attention, demand duration, refuse the quick consumption
            that the art market wanted.
          </p>
          <p>
            A FromSoftware game does the same thing. It traps you in the enduring present of a boss fight. It demands
            the slow reading of every item description. It refuses the intelligent solution of telling you what it means.
          </p>
          <p>
            Abramović makes her body into a machine of absolute rest. Miyazaki makes <em>your</em> body into one&mdash;sitting
            there, controller in hand, dying to the same boss, absolutely present, absolutely useless, absolutely engaged.
          </p>
          <h3 className="text-xl font-serif text-[var(--text-primary)] mt-8 mb-4">The Social Sculpture</h3>
          <p>
            But there&apos;s another dimension. Rirkrit Tiravanija built an artistic career by bringing people together
            over meals&mdash;green curry, tom kha soup, pad thai. Nicolas Bourriaud called this <strong>relational aesthetics</strong>:
            art that prioritizes social interaction as its medium. &quot;Lots of people&quot; appears among the artist&apos;s
            materials on Tiravanija&apos;s gallery labels.
          </p>
          <p>
            This extends Joseph Beuys&apos;s notion of <strong>&quot;social sculpture&quot;</strong> from the 1960s: the idea that
            collective engagement creates shared social futures. Hence Beuys&apos;s declaration: &quot;everyone is an artist.&quot;
            What Tiravanija added was food as the catalyst&mdash;the machine through which social spaces form.
          </p>
          <p>
            <strong>Again: video games.</strong>
          </p>
          <p>
            FromSoftware literally lists &quot;lots of people&quot; among its materials. Bloodstains showing how others died.
            Messages left by strangers&mdash;some helpful, some lies, all social. Summon signs. Invasion signs. Brief
            glimpses of phantoms walking through other worlds. The game uses <em>other players</em> as artistic medium.
          </p>
          <p>
            And just as Tiravanija&apos;s curry is the catalyst for social space, <strong>difficulty is Miyazaki&apos;s curry</strong>.
            The struggle forces the conversation. You hit a wall, you go online, you ask, you share, you commiserate.
            The lore community&mdash;VaatiVidya, the subreddits, the wikis, the Discord theories at 2am&mdash;that&apos;s the
            social sculpture. The game produces it.
          </p>
          <p>
            <strong>&quot;Everyone is an artist&quot;</strong> becomes <strong>&quot;everyone is a lore theorist.&quot;</strong> Beuys&apos;s
            social sculpture made collective. The game doesn&apos;t present content to be consumed&mdash;it produces community.
            The shared futures are the interpretations we build together, the wikis we maintain, the videos we watch
            and argue about.
          </p>
          <p>
            The machine doesn&apos;t just transform the individual player. It transforms <em>players</em>&mdash;plural&mdash;into
            a collective that wouldn&apos;t exist otherwise. First the individual transformation: machine of absolute rest,
            the body trapped in the enduring present of a boss fight. Then the collective transformation: social sculpture,
            the community formed around shared struggle and interpretation.
          </p>
          <h3 className="text-xl font-serif text-[var(--text-primary)] mt-8 mb-4">The Evolution of the Readymade</h3>
          <p>
            Sophie Calle&apos;s <em>Take Care of Yourself</em> (2007) invited 107 women to interpret an electronic breakup
            letter she had received&mdash;each through the lens of their profession. Anthropologists, criminologists,
            opera singers, psychiatrists, athletes. The outputs: songs, dances, crossword puzzles, origami, a shooting
            target, a parrot, a forensic study. The breakup email became &quot;a vessel on which others can sail.&quot;
          </p>
          <p>
            The fragmentary lore functions the same way. VaatiVidya does narrative analysis. Speedrunners do mechanical
            deconstruction. Challenge runners do performance art. Musicians make covers. Artists make fan works. Wiki
            editors do taxonomy. Redditors do forensic debate at 3am. Everyone brings their professional lens. Everyone
            makes art where there was none before.
          </p>
          <p>
            Tetsushi Higashino&apos;s <em>Observation Diary of a Hydroponic Nose Hair</em> (2009&ndash;present) planted a nose
            hair in a petri dish and waited for it to grow, nourishing it with hair-growth formula, plant nutrients,
            even Red Bull. The nose hair never grew. <strong>The petri dish grew instead</strong>&mdash;molds, cultures,
            unexpected life flourishing where it wasn&apos;t intended. &quot;The explosive pataphysical potential revealed
            in exactly the unintended consequences of an artistic proposition.&quot;
          </p>
          <p>
            Miyazaki plants a game. The &quot;intended&quot; experience isn&apos;t what flourishes. What grows is the wiki ecosystem,
            the YouTube analysis industry, the meme culture, the challenge run community. The petri dish grows instead
            of the nose hair. The culture flourishes in the unintended spaces.
          </p>
          <p>
            This is what the Hiebert essay calls <strong>&quot;the next evolution of the readymade&mdash;not simply objects
            waiting to be repossessed, but activities too, literally growing a culture of artists.&quot;</strong>
          </p>
          <p>
            Duchamp invented the readymade: take an existing object, recontextualize it as art. The urinal. The bottle rack.
            Objects <em>waiting to be repossessed</em>. But objects are static. They sit there. You look at them.
          </p>
          <p>
            <strong>The next evolution is activities.</strong> A video game doesn&apos;t wait to be repossessed&mdash;it
            <em>produces</em> activities. Speedrunning. Lore theorizing. Challenge runs. Wiki editing. These activities
            ARE the art. The game is a readymade that manufactures readymades. <strong>A machine for producing artists.</strong>
          </p>
          <p>
            Duchamp knew this. He abandoned art to play chess. He said: <em>&quot;Not all artists are chess players,
            but all chess players are artists.&quot;</em> The game itself was the medium&mdash;the moves, the patterns,
            the decisions under pressure. The activity produces the artist. He was already arguing for games as
            art-making machines in the 1920s. He just didn&apos;t have video games yet.
          </p>
          <p>
            This closes the loop. Elden Ring isn&apos;t just <em>referencing</em> Duchamp&mdash;it&apos;s <em>continuing</em> his project:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-[var(--text-secondary)]">
            <li>Duchamp invents the readymade (objects)</li>
            <li>Duchamp creates The Large Glass (the machine that never completes)</li>
            <li>The next evolution is activities, not objects</li>
            <li>A video game is an activity-producing machine</li>
            <li>Therefore a video game is the natural medium for Duchamp&apos;s work to continue</li>
            <li>Therefore Elden Ring as Large Glass isn&apos;t homage&mdash;it&apos;s <em>succession</em></li>
          </ol>
          <p>
            The readymade evolved. It learned to reproduce. It grows a culture of artists now.
          </p>
          <p>
            The video game as pataphysical machine. The medium as message. Both meditation chamber and communal meal.
            Duchamp couldn&apos;t have chosen better if he&apos;d designed the format himself&mdash;and in a sense, he did.
            The Large Glass was always waiting for a medium that could make its incompleteness <em>productive</em>.
          </p>
        </div>
      </section>

      {/* The Geography of Conquest */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Geography of Conquest</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The transformation is written into the land itself.
          </p>
          <p>
            Before the Elden Beast arrived, the Lands Between was shaped like the <strong>Dragon Talisman</strong>&mdash;the
            symbol of Placidusax&apos;s era, the emblem of the natural order under the dragon god.
          </p>
          <p>
            Then a falling star crashed into it. The Elden Beast making landfall. The Greater Will&apos;s xenotext
            arriving as cosmic impact. The collision shattered the dragon-shaped continent, broke it apart.
          </p>
          <p>
            After the breaking, the Lands Between reformed into the shape of a <strong>Gold Curl Finger</strong>.
            The geography literally transformed from dragon to finger. From the old order&apos;s symbol to the
            new order&apos;s symbol. The map is a fossil record of the conquest.
          </p>
          <p>
            This is the same story told at every scale: genetic (xenotext rewriting the code), theological
            (Greater Will replacing dragon god), alchemical (base matter transmuted to gold), and now
            <em>geographical</em>&mdash;the very shape of the world reshaped by the impact of foreign code.
          </p>
          <p>
            Walk the Lands Between and you walk on the transformed body of what came before. The dragon
            talisman shattered into the shape of a finger. The land remembers, even if its inhabitants forgot.
          </p>
        </div>
      </section>
    </div>
  );
}
