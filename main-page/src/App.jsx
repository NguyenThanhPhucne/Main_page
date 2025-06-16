"use client"

import { useState, useRef, useEffect } from "react"
import { Home, Hash, Volume2, ChevronDown, ChevronRight, Plus, Settings, Bell, Users, Search, Paperclip, Smile, Mic, MicOff, Headphones, Gamepad2, BookOpen, Music, Palette, Monitor, ChevronLeft, Sun, Moon, UserPlus, LogOut, X, } from "lucide-react"
import "./App.css"

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [activeChannel, setActiveChannel] = useState("general")
  const [currentServer, setCurrentServer] = useState(0)
  const [serverScrollIndex, setServerScrollIndex] = useState(0)
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const [showServerDropdown, setShowServerDropdown] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const dropdownRef = useRef(null)

  // Server data
  const servers = [
    { id: 1, name: "Gaming Hub", icon: Gamepad2, color: "#5865f2" },
    { id: 2, name: "Study Group", icon: BookOpen, color: "#57f287" },
    { id: 3, name: "Music Lovers", icon: Music, color: "#fee75c" },
    { id: 4, name: "Art Community", icon: Palette, color: "#eb459e" },
    { id: 5, name: "Tech Talk", icon: Monitor, color: "#00d4aa" },
  ]

  const textChannels = [
    { id: "general", name: "general" },
    { id: "memes", name: "memes" },
    { id: "gaming", name: "gaming" },
  ]

  const voiceChannels = [
    { id: "general-voice", name: "General Voice" },
    { id: "gaming-voice", name: "Gaming Voice" },
  ]

  // Server dropdown menu items
  const serverMenuItems = [
    { id: "invite", label: "Invite People", icon: UserPlus, color: "normal" },
    { id: "settings", label: "Server Settings", icon: Settings, color: "normal" },
    { id: "notifications", label: "Notification Settings", icon: Bell, color: "normal" },
    { id: "leave", label: "Leave Server", icon: LogOut, color: "danger" },
  ]

  // Handlers
  const toggleTheme = () => setIsDarkTheme(!isDarkTheme)

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // If deafened, unmute both when clicking mic
    if (isDeafened) {
      setIsDeafened(false)
    }
  }

  const toggleDeafen = () => {
    const newDeafenState = !isDeafened
    setIsDeafened(newDeafenState)
    // When deafening, also mute mic
    if (newDeafenState) {
      setIsMuted(true)
    }
  }

  const scrollServers = (direction) => {
    const maxScroll = Math.max(0, servers.length - 3)
    if (direction === "left" && serverScrollIndex > 0) {
      setServerScrollIndex(serverScrollIndex - 1)
    } else if (direction === "right" && serverScrollIndex < maxScroll) {
      setServerScrollIndex(serverScrollIndex + 1)
    }
  }

  const toggleCategory = (categoryId) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const toggleServerDropdown = () => {
    setShowServerDropdown(!showServerDropdown)
  }

  const handleServerMenuClick = (itemId) => {
    console.log(`Clicked: ${itemId}`)
    setShowServerDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowServerDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const visibleServers = servers.slice(serverScrollIndex, serverScrollIndex + 3)

  return (
    <div className={`app ${isDarkTheme ? "theme-dark" : "theme-light"}`}>
      {/* Header */}
      <header className="header">
        <div className="header__home">
          <button className="home-btn">
            <Home size={20} />
          </button>
        </div>

        <div className="header__servers">
          {serverScrollIndex > 0 && (
            <button className="scroll-btn" onClick={() => scrollServers("left")}>
              <ChevronLeft size={16} />
            </button>
          )}

          <div className="server-list">
            {visibleServers.map((server, index) => {
              const actualIndex = serverScrollIndex + index
              const ServerIcon = server.icon
              return (
                <button
                  key={server.id}
                  className={`server-btn ${currentServer === actualIndex ? "server-btn--active" : ""}`}
                  onClick={() => setCurrentServer(actualIndex)}
                  style={{ "--server-color": server.color }}
                  title={server.name}
                >
                  <ServerIcon size={20} />
                </button>
              )
            })}
          </div>

          {serverScrollIndex < servers.length - 3 && (
            <button className="scroll-btn" onClick={() => scrollServers("right")}>
              <ChevronRight size={16} />
            </button>
          )}

          <button className="add-server-btn">
            <Plus size={20} />
          </button>
        </div>

        <div className="header__controls">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="user-panel">
            <div className="user-info">
              <div className="user-avatar">
                <span>A</span>
                <div className="status-dot"></div>
              </div>
              <div className="user-details">
                <span className="username">You</span>
                <span className="status">Online</span>
              </div>
            </div>
            <div className="user-actions">
              <button
                className={`action-btn ${isMuted ? "action-btn--muted" : ""}`}
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                className={`action-btn ${isDeafened ? "action-btn--deafened" : ""}`}
                onClick={toggleDeafen}
                title={isDeafened ? "Undeafen" : "Deafen"}
              >
                <Headphones size={16} />
                {isDeafened && <div className="deafen-indicator"></div>}
              </button>
              <button className="action-btn" title="Settings">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="main">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__header" ref={dropdownRef}>
            <button className="server-dropdown-btn" onClick={toggleServerDropdown}>
              <h3>{servers[currentServer].name}</h3>
              <ChevronDown size={16} className={`dropdown-arrow ${showServerDropdown ? "dropdown-arrow--open" : ""}`} />
            </button>

            {/* Server Dropdown Menu */}
            {showServerDropdown && (
              <div className="server-dropdown">
                <div className="server-dropdown__header">
                  <span>{servers[currentServer].name}</span>
                  <button className="close-btn" onClick={() => setShowServerDropdown(false)}>
                    <X size={16} />
                  </button>
                </div>

                <div className="server-dropdown__content">
                  {serverMenuItems.map((item, index) => {
                    const ItemIcon = item.icon
                    return (
                      <button
                        key={item.id}
                        className={`dropdown-item ${item.color === "danger" ? "dropdown-item--danger" : ""}`}
                        onClick={() => handleServerMenuClick(item.id)}
                      >
                        <ItemIcon size={16} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="sidebar__content">
            {/* Text Channels */}
            <div className="category">
              <button className="category__header" onClick={() => toggleCategory("text")}>
                {collapsedCategories.text ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                <span>TEXT CHANNELS</span>
                <Plus size={16} className="category__add" />
              </button>

              <div className={`category__content ${collapsedCategories.text ? "category__content--collapsed" : ""}`}>
                {textChannels.map((channel) => (
                  <button
                    key={channel.id}
                    className={`channel ${activeChannel === channel.id ? "channel--active" : ""}`}
                    onClick={() => setActiveChannel(channel.id)}
                  >
                    <Hash size={16} />
                    <span>{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Channels */}
            <div className="category">
              <button className="category__header" onClick={() => toggleCategory("voice")}>
                {collapsedCategories.voice ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                <span>VOICE CHANNELS</span>
                <Plus size={16} className="category__add" />
              </button>

              <div className={`category__content ${collapsedCategories.voice ? "category__content--collapsed" : ""}`}>
                {voiceChannels.map((channel) => (
                  <button key={channel.id} className="channel channel--voice">
                    <Volume2 size={16} />
                    <span>{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="content">
          <div className="content__header">
            <div className="channel-info">
              <Hash size={20} />
              <span className="channel-name">{activeChannel}</span>
              <span className="channel-desc">Welcome to #{activeChannel}!</span>
            </div>

            <div className="header-actions">
              <button className="action-btn">
                <Bell size={20} />
              </button>
              <button className="action-btn">
                <Users size={20} />
              </button>
              <div className="search">
                <Search size={16} />
                <input type="text" placeholder="Search" />
              </div>
            </div>
          </div>

          <div className="content__body">
            <div className="welcome">
              <div className="welcome__icon">
                <Hash size={48} />
              </div>
              <h2>Welcome to #{activeChannel}!</h2>
              <p>This is the start of the #{activeChannel} channel.</p>
            </div>
          </div>

          <div className="content__footer">
            <div className="message-input">
              <Paperclip size={20} />
              <input type="text" placeholder={`Message #${activeChannel}`} />
              <Smile size={20} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
