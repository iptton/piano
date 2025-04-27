"use client"

import { useState, useEffect, useRef } from "react"
import { Music, Volume2, VolumeX, Play, Pause, FastForward, Rewind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// Piano notes with their corresponding frequencies across multiple octaves
const NOTES = [
  // Octave 2
  { note: "C2", freq: 65.41, key: "q", color: "white", octave: 2 },
  { note: "C#2", freq: 69.3, key: "2", color: "black", octave: 2 },
  { note: "D2", freq: 73.42, key: "w", color: "white", octave: 2 },
  { note: "D#2", freq: 77.78, key: "3", color: "black", octave: 2 },
  { note: "E2", freq: 82.41, key: "e", color: "white", octave: 2 },
  { note: "F2", freq: 87.31, key: "r", color: "white", octave: 2 },
  { note: "F#2", freq: 92.5, key: "5", color: "black", octave: 2 },
  { note: "G2", freq: 98.0, key: "t", color: "white", octave: 2 },
  { note: "G#2", freq: 103.83, key: "6", color: "black", octave: 2 },
  { note: "A2", freq: 110.0, key: "y", color: "white", octave: 2 },
  { note: "A#2", freq: 116.54, key: "7", color: "black", octave: 2 },
  { note: "B2", freq: 123.47, key: "u", color: "white", octave: 2 },

  // Octave 3
  { note: "C3", freq: 130.81, key: "i", color: "white", octave: 3 },
  { note: "C#3", freq: 138.59, key: "9", color: "black", octave: 3 },
  { note: "D3", freq: 146.83, key: "o", color: "white", octave: 3 },
  { note: "D#3", freq: 155.56, key: "0", color: "black", octave: 3 },
  { note: "E3", freq: 164.81, key: "p", color: "white", octave: 3 },
  { note: "F3", freq: 174.61, key: "z", color: "white", octave: 3 },
  { note: "F#3", freq: 185.0, key: "s", color: "black", octave: 3 },
  { note: "G3", freq: 196.0, key: "x", color: "white", octave: 3 },
  { note: "G#3", freq: 207.65, key: "d", color: "black", octave: 3 },
  { note: "A3", freq: 220.0, key: "c", color: "white", octave: 3 },
  { note: "A#3", freq: 233.08, key: "f", color: "black", octave: 3 },
  { note: "B3", freq: 246.94, key: "v", color: "white", octave: 3 },

  // Octave 4 (middle octave)
  { note: "C4", freq: 261.63, key: "b", color: "white", octave: 4 },
  { note: "C#4", freq: 277.18, key: "h", color: "black", octave: 4 },
  { note: "D4", freq: 293.66, key: "n", color: "white", octave: 4 },
  { note: "D#4", freq: 311.13, key: "j", color: "black", octave: 4 },
  { note: "E4", freq: 329.63, key: "m", color: "white", octave: 4 },
  { note: "F4", freq: 349.23, key: ",", color: "white", octave: 4 },
  { note: "F#4", freq: 369.99, key: "l", color: "black", octave: 4 },
  { note: "G4", freq: 392.0, key: ".", color: "white", octave: 4 },
  { note: "G#4", freq: 415.3, key: ";", color: "black", octave: 4 },
  { note: "A4", freq: 440.0, key: "/", color: "white", octave: 4 },
  { note: "A#4", freq: 466.16, key: "'", color: "black", octave: 4 },
  { note: "B4", freq: 493.88, key: "a", color: "white", octave: 4 },

  // Octave 5
  { note: "C5", freq: 523.25, key: "k", color: "white", octave: 5 },
  { note: "C#5", freq: 554.37, key: "w", color: "black", octave: 5 },
  { note: "D5", freq: 587.33, key: "s", color: "white", octave: 5 },
  { note: "D#5", freq: 622.25, key: "e", color: "black", octave: 5 },
  { note: "E5", freq: 659.25, key: "d", color: "white", octave: 5 },
  { note: "F5", freq: 698.46, key: "f", color: "white", octave: 5 },
  { note: "F#5", freq: 739.99, key: "t", color: "black", octave: 5 },
  { note: "G5", freq: 783.99, key: "g", color: "white", octave: 5 },
  { note: "G#5", freq: 830.61, key: "y", color: "black", octave: 5 },
  { note: "A5", freq: 880.0, key: "h", color: "white", octave: 5 },
  { note: "A#5", freq: 932.33, key: "u", color: "black", octave: 5 },
  { note: "B5", freq: 987.77, key: "j", color: "white", octave: 5 },

  // Octave 6
  { note: "C6", freq: 1046.5, key: "k", color: "white", octave: 6 },
]

// Simple songs for practice with timing information (in beats)
const SONGS = {
  "Twinkle Twinkle": {
    notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"],
    durations: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2],
    tempo: 120, // beats per minute
  },
  "Mary Had a Little Lamb": {
    notes: ["E4", "D4", "C4", "D4", "E4", "E4", "E4", "D4", "D4", "D4", "E4", "G4", "G4"],
    durations: [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2],
    tempo: 100,
  },
  "Jingle Bells": {
    notes: ["E4", "E4", "E4", "E4", "E4", "E4", "E4", "G4", "C4", "D4", "E4"],
    durations: [1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 4],
    tempo: 140,
  },
  "Ode to Joy": {
    notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "E4", "D4", "D4"],
    durations: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2],
    tempo: 110,
  },
}

// Note animation type
type NoteAnimation = {
  note: string
  id: string
  x: number
  y: number
  color: string
  opacity: number
  scale: number
}

export default function PianoGame() {
  const [activeNotes, setActiveNotes] = useState<string[]>([])
  const [muted, setMuted] = useState(false)
  const [currentSong, setCurrentSong] = useState<string | null>(null)
  const [songNotes, setSongNotes] = useState<string[]>([])
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [gameMode, setGameMode] = useState<"free" | "practice" | "autoplay">("free")
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const keyboardRef = useRef<HTMLDivElement>(null)
  const [visibleOctave, setVisibleOctave] = useState(4) // Default to middle C (C4)
  const [noteAnimations, setNoteAnimations] = useState<NoteAnimation[]>([])
  const [keyPositions, setKeyPositions] = useState<Record<string, { x: number; y: number }>>({})
  const animationFrameRef = useRef<number | null>(null)

  // Auto-play related states
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(1.0) // 1.0 = normal speed
  const [autoPlayProgress, setAutoPlayProgress] = useState(0)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autoPlayIndexRef = useRef(0)

  const audioContext = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize audio context on first user interaction
    const handleFirstInteraction = () => {
      if (!audioContext.current) {
        audioContext.current = new AudioContext()
      }
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("touchstart", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
    }
  }, [])

  useEffect(() => {
    // Set up keyboard listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const note = NOTES.find((n) => n.key === e.key.toLowerCase())
      if (note && !activeNotes.includes(note.note)) {
        playNote(note.note, note.freq)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = NOTES.find((n) => n.key === e.key.toLowerCase())
      if (note) {
        setActiveNotes((prev) => prev.filter((n) => n !== note.note))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [activeNotes])

  useEffect(() => {
    if (currentSong) {
      const songData = SONGS[currentSong as keyof typeof SONGS]
      setSongNotes(songData.notes)
      setCurrentNoteIndex(0)
      setGameMode(isAutoPlaying ? "autoplay" : "practice")

      // Reset autoplay index when song changes
      autoPlayIndexRef.current = 0
      setAutoPlayProgress(0)

      // If autoplay is active, start playing the new song
      if (isAutoPlaying) {
        startAutoPlay()
      }
    }
  }, [currentSong, isAutoPlaying])

  // Stop autoplay when component unmounts
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current)
      }
    }
  }, [])

  // Animation loop for floating notes
  useEffect(() => {
    const updateAnimations = () => {
      setNoteAnimations((prevAnimations) => {
        // Update each animation
        const updatedAnimations = prevAnimations
          .map((anim) => ({
            ...anim,
            y: anim.y - 2, // Move upward
            opacity: anim.opacity - 0.01, // Fade out
            scale: anim.scale + 0.005, // Grow slightly
          }))
          .filter((anim) => anim.opacity > 0) // Remove completely faded animations

        return updatedAnimations
      })

      animationFrameRef.current = requestAnimationFrame(updateAnimations)
    }

    animationFrameRef.current = requestAnimationFrame(updateAnimations)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Update key positions when keyboard is scrolled
  useEffect(() => {
    if (keyboardRef.current) {
      const updateKeyPositions = () => {
        const newPositions: Record<string, { x: number; y: number }> = {}
        const keyElements = keyboardRef.current?.querySelectorAll("[data-note]")

        keyElements?.forEach((element) => {
          const note = element.getAttribute("data-note")
          if (note) {
            const rect = element.getBoundingClientRect()
            newPositions[note] = {
              x: rect.left + rect.width / 2,
              y: rect.top,
            }
          }
        })

        setKeyPositions(newPositions)
      }

      // Update positions initially and when scrolling
      updateKeyPositions()
      keyboardRef.current.addEventListener("scroll", updateKeyPositions)

      return () => {
        keyboardRef.current?.removeEventListener("scroll", updateKeyPositions)
      }
    }
  }, [scrollPosition])

  // Effect to handle auto-play state changes
  useEffect(() => {
    if (isAutoPlaying && currentSong) {
      startAutoPlay()
    } else {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current)
        autoPlayTimerRef.current = null
      }
    }
  }, [isAutoPlaying, autoPlaySpeed])

  const createNoteAnimation = (note: string) => {
    const position = keyPositions[note]
    if (!position) return

    // Get note color based on octave
    const noteInfo = NOTES.find((n) => n.note === note)
    const octave = noteInfo?.octave || 4

    // Generate color based on octave (rainbow effect)
    const hue = ((octave - 2) * 60) % 360 // Spread colors across octaves
    const color = `hsl(${hue}, 80%, 60%)`

    const newAnimation: NoteAnimation = {
      note,
      id: `${note}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      x: position.x,
      y: position.y,
      color,
      opacity: 1,
      scale: 1,
    }

    setNoteAnimations((prev) => [...prev, newAnimation])
  }

  const playNote = (note: string, frequency: number) => {
    if (muted || !audioContext.current) return

    // Add note to active notes
    setActiveNotes((prev) => [...prev, note])

    // Create visual animation
    createNoteAnimation(note)

    // Create oscillator
    const oscillator = audioContext.current.createOscillator()
    const gainNode = audioContext.current.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime)

    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.current.destination)

    // Start sound
    oscillator.start()

    // Fade out for a piano-like sound
    gainNode.gain.setValueAtTime(0.5, audioContext.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 1.5)

    // Stop after decay
    setTimeout(() => {
      oscillator.stop()
      setActiveNotes((prev) => prev.filter((n) => n !== note))

      // Check if this is the correct note in practice mode
      if (gameMode === "practice" && note === songNotes[currentNoteIndex]) {
        setCurrentNoteIndex((prev) => {
          if (prev + 1 >= songNotes.length) {
            // Song completed
            setTimeout(() => {
              alert("Great job! You completed the song!")
              setGameMode("free")
              setCurrentSong(null)
            }, 500)
            return 0
          }
          return prev + 1
        })
      }
    }, 1000)
  }

  const handlePianoKeyPress = (note: string, freq: number) => {
    playNote(note, freq)
  }

  const toggleMute = () => {
    setMuted(!muted)
  }

  const startSong = (song: string) => {
    setCurrentSong(song)
  }

  const updateVisibleOctave = (scrollPos: number) => {
    if (!keyboardRef.current) return

    const totalWidth = keyboardRef.current.scrollWidth
    const viewportWidth = keyboardRef.current.clientWidth
    const scrollRatio = scrollPos / (totalWidth - viewportWidth)

    // Calculate which octave is most visible
    const octaveRange = 6 - 2 // From C2 to C6
    const estimatedOctave = Math.round(2 + scrollRatio * octaveRange)
    setVisibleOctave(Math.min(Math.max(estimatedOctave, 2), 6))
  }

  // Scroll to make a specific note visible
  const scrollToNote = (note: string) => {
    if (!keyboardRef.current) return

    const noteElement = keyboardRef.current.querySelector(`[data-note="${note}"]`)
    if (noteElement) {
      const rect = noteElement.getBoundingClientRect()
      const containerRect = keyboardRef.current.getBoundingClientRect()

      // Calculate if the note is visible
      const isVisible = rect.left >= containerRect.left && rect.right <= containerRect.right

      if (!isVisible) {
        // Calculate the scroll position to center the note
        const scrollLeft =
          keyboardRef.current.scrollLeft + (rect.left - containerRect.left) - containerRect.width / 2 + rect.width / 2
        keyboardRef.current.scrollLeft = scrollLeft
        setScrollPosition(scrollLeft)
        updateVisibleOctave(scrollLeft)
      }
    }
  }

  // Start auto-playing the current song
  const startAutoPlay = () => {
    if (!currentSong || !isAutoPlaying) return

    const songData = SONGS[currentSong as keyof typeof SONGS]
    const { notes, durations, tempo } = songData

    // Clear any existing timer
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current)
    }

    // Calculate beat duration in milliseconds, adjusted by speed
    const beatDuration = 60000 / tempo / autoPlaySpeed

    const playNextNote = () => {
      const index = autoPlayIndexRef.current

      if (index < notes.length) {
        // Play the current note
        const note = notes[index]
        const noteInfo = NOTES.find((n) => n.note === note)

        if (noteInfo) {
          // Scroll to make the note visible
          scrollToNote(note)

          // Play the note
          playNote(note, noteInfo.freq)

          // Update progress
          setAutoPlayProgress(((index + 1) / notes.length) * 100)

          // Schedule the next note
          const duration = durations[index] * beatDuration
          autoPlayIndexRef.current = index + 1

          autoPlayTimerRef.current = setTimeout(playNextNote, duration)
        }
      } else {
        // Song finished
        autoPlayIndexRef.current = 0
        setAutoPlayProgress(0)

        // If loop is enabled, start again (optional feature)
        if (isAutoPlaying) {
          autoPlayTimerRef.current = setTimeout(playNextNote, beatDuration / 2)
        } else {
          setIsAutoPlaying(false)
        }
      }
    }

    // Start playing from the current index
    playNextNote()
  }

  // Toggle auto-play
  const toggleAutoPlay = () => {
    if (!currentSong) {
      // If no song is selected, select the first one
      const firstSong = Object.keys(SONGS)[0]
      setCurrentSong(firstSong)
    }

    setIsAutoPlaying(!isAutoPlaying)
    setGameMode(!isAutoPlaying ? "autoplay" : "practice")
  }

  // Change auto-play speed
  const changeAutoPlaySpeed = (newSpeed: number[]) => {
    setAutoPlaySpeed(newSpeed[0])
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <Music className="mr-2" /> 钢琴小游戏
        </h1>

        <div className="w-full bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {gameMode === "practice"
                ? `练习: ${currentSong}`
                : gameMode === "autoplay"
                  ? `自动播放: ${currentSong}`
                  : "自由演奏模式"}
            </h2>
            <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>

          {(gameMode === "practice" || gameMode === "autoplay") && (
            <div className="mb-4 p-2 bg-blue-50 rounded text-center">
              {gameMode === "practice" && (
                <>
                  <p className="text-sm mb-1">下一个音符:</p>
                  <p className="text-lg font-bold">{songNotes[currentNoteIndex]}</p>
                </>
              )}

              {gameMode === "autoplay" && (
                <>
                  <p className="text-sm mb-1">自动播放进度:</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        // Reset to beginning
                        autoPlayIndexRef.current = 0
                        setAutoPlayProgress(0)
                        if (isAutoPlaying) startAutoPlay()
                      }}
                    >
                      <Rewind className="h-4 w-4" />
                    </Button>

                    <Button variant={isAutoPlaying ? "default" : "outline"} className="flex-1" onClick={toggleAutoPlay}>
                      {isAutoPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isAutoPlaying ? "暂停" : "播放"}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        // Skip to next song
                        const songKeys = Object.keys(SONGS)
                        const currentIndex = songKeys.indexOf(currentSong || "")
                        const nextIndex = (currentIndex + 1) % songKeys.length
                        setCurrentSong(songKeys[nextIndex])
                      }}
                    >
                      <FastForward className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Speed control */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>速度: {autoPlaySpeed.toFixed(1)}x</span>
                    </div>
                    <Slider value={[autoPlaySpeed]} min={0.5} max={2} step={0.1} onValueChange={changeAutoPlaySpeed} />
                  </div>
                </>
              )}

              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${gameMode === "autoplay" ? autoPlayProgress : (currentNoteIndex / songNotes.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Piano Keyboard with Dragging */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">当前八度: {visibleOctave}</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (keyboardRef.current) {
                    const newPos = Math.max(scrollPosition - 200, 0)
                    keyboardRef.current.scrollLeft = newPos
                    setScrollPosition(newPos)
                    updateVisibleOctave(newPos)
                  }
                }}
              >
                ← 左移
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (keyboardRef.current) {
                    const maxScroll = keyboardRef.current.scrollWidth - keyboardRef.current.clientWidth
                    const newPos = Math.min(scrollPosition + 200, maxScroll)
                    keyboardRef.current.scrollLeft = newPos
                    setScrollPosition(newPos)
                    updateVisibleOctave(newPos)
                  }
                }}
              >
                右移 →
              </Button>
            </div>
          </div>

          {/* Floating note animations */}
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-0 pointer-events-none">
              {noteAnimations.map((anim) => (
                <div
                  key={anim.id}
                  className="absolute transform -translate-x-1/2 pointer-events-none"
                  style={{
                    left: `${anim.x}px`,
                    top: `${anim.y}px`,
                    opacity: anim.opacity,
                    transform: `scale(${anim.scale})`,
                  }}
                >
                  <div
                    className="rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: anim.color }}
                  >
                    {anim.note}
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={keyboardRef}
              className="relative w-full overflow-x-auto touch-none select-none"
              style={{
                overscrollBehavior: "none",
                WebkitOverflowScrolling: "touch",
              }}
              onMouseDown={(e) => {
                setIsDragging(true)
                setStartX(e.clientX - scrollPosition)
              }}
              onMouseMove={(e) => {
                if (isDragging && keyboardRef.current) {
                  const x = e.clientX - startX
                  const newPos = Math.max(
                    0,
                    Math.min(x, keyboardRef.current.scrollWidth - keyboardRef.current.clientWidth),
                  )
                  keyboardRef.current.scrollLeft = newPos
                  setScrollPosition(newPos)
                  updateVisibleOctave(newPos)
                }
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchStart={(e) => {
                setIsDragging(true)
                setStartX(e.touches[0].clientX - scrollPosition)
              }}
              onTouchMove={(e) => {
                if (isDragging && keyboardRef.current) {
                  e.preventDefault()
                  const x = e.touches[0].clientX - startX
                  const newPos = Math.max(
                    0,
                    Math.min(x, keyboardRef.current.scrollWidth - keyboardRef.current.clientWidth),
                  )
                  keyboardRef.current.scrollLeft = newPos
                  setScrollPosition(newPos)
                  updateVisibleOctave(newPos)
                }
              }}
              onTouchEnd={() => setIsDragging(false)}
            >
              <div
                className="flex relative h-48"
                style={{ width: `${NOTES.filter((n) => n.color === "white").length * 40}px` }}
              >
                {NOTES.map((note, index) => {
                  // Calculate white key index for positioning black keys
                  const whiteKeysBefore = NOTES.filter((n, i) => n.color === "white" && i < index).length
                  const isActive = activeNotes.includes(note.note)

                  // Check if this note is the next one to play in autoplay mode
                  const isNextAutoplayNote =
                    gameMode === "autoplay" &&
                    isAutoPlaying &&
                    autoPlayIndexRef.current < songNotes.length &&
                    note.note === songNotes[autoPlayIndexRef.current]

                  return (
                    <div
                      key={note.note}
                      data-note={note.note}
                      className={cn(
                        "relative",
                        note.color === "white" ? "flex-1 z-0" : "z-10 absolute",
                        // Add octave indicator for C notes
                        note.note.includes("C") && note.color === "white" && "border-l-2 border-blue-300",
                      )}
                      style={{
                        left: note.color === "black" ? `${(whiteKeysBefore - 0.3) * 40}px` : undefined,
                        height: note.color === "black" ? "60%" : "100%",
                        minWidth: note.color === "white" ? "40px" : undefined,
                        width: note.color === "black" ? "24px" : undefined,
                      }}
                    >
                      <button
                        className={cn(
                          "w-full h-full rounded-b-md border border-gray-300 flex flex-col items-center justify-end pb-2 transition-all duration-150",
                          note.color === "white"
                            ? "bg-white hover:bg-gray-100"
                            : "bg-gray-800 hover:bg-gray-700 text-white",
                          isActive && note.color === "white" && "bg-blue-100 shadow-inner shadow-blue-200",
                          isActive && note.color === "black" && "bg-gray-600 shadow-inner shadow-gray-900",
                          gameMode === "practice" &&
                            songNotes[currentNoteIndex] === note.note &&
                            "ring-2 ring-blue-500",
                          // Add transform for pressed effect
                          isActive && "transform translate-y-1",
                          // Highlight next autoplay note
                          isNextAutoplayNote && note.color === "white" && "ring-2 ring-green-500 bg-green-50",
                          isNextAutoplayNote && note.color === "black" && "ring-2 ring-green-500",
                        )}
                        style={{
                          // Add dynamic gradient based on octave when active
                          background: isActive
                            ? note.color === "white"
                              ? `linear-gradient(to bottom, #ffffff, ${getOctaveColor(note.octave, 0.2)})`
                              : `linear-gradient(to bottom, #333333, ${getOctaveColor(note.octave, 0.5)})`
                            : undefined,
                        }}
                        onTouchStart={(e) => {
                          // Don't prevent default here to allow dragging
                          if (!isDragging) {
                            handlePianoKeyPress(note.note, note.freq)
                          }
                        }}
                        onTouchEnd={() => {
                          if (!isDragging) {
                            setActiveNotes((prev) => prev.filter((n) => n !== note.note))
                          }
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation() // Prevent dragging when clicking keys
                          handlePianoKeyPress(note.note, note.freq)
                        }}
                        onMouseUp={() => setActiveNotes((prev) => prev.filter((n) => n !== note.note))}
                        onMouseLeave={() => setActiveNotes((prev) => prev.filter((n) => n !== note.note))}
                      >
                        {/* Ripple effect when key is active */}
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <div className="ripple-effect"></div>
                          </div>
                        )}

                        <span className="text-xs font-medium opacity-70">{note.note}</span>
                        {note.note.includes("C") && (
                          <span className="text-[10px] opacity-50 mt-1">八度{note.octave}</span>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Song Selection */}
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">歌曲选择</h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(SONGS).map((song) => (
              <div key={song} className="flex items-center">
                <Button
                  variant="outline"
                  className={cn("justify-start flex-1", currentSong === song && "bg-blue-50 border-blue-200")}
                  onClick={() => startSong(song)}
                >
                  {song}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => {
                    setCurrentSong(song)
                    setIsAutoPlaying(true)
                    setGameMode("autoplay")
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>使用触摸屏幕弹奏钢琴，左右拖动查看更多音符</p>
          <p className="mt-1">点击歌曲旁边的播放按钮可自动播放</p>
          <p className="mt-1">音域范围：C2-C6（共5个八度）</p>
        </div>
      </div>
    </main>
  )
}

// Helper function to get color based on octave
function getOctaveColor(octave: number, alpha = 1): string {
  const hue = ((octave - 2) * 60) % 360 // Spread colors across octaves
  return `hsla(${hue}, 80%, 60%, ${alpha})`
}
