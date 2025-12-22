import React, { useRef, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Menu, X, Github, Copy, Check, Terminal } from 'lucide-react'
import { Cursor, Qwen, GithubCopilot } from '@lobehub/icons'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import Folder from '@/components/ui/folder'
import { cn } from '@/lib/utils'
// @ts-ignore
import ComposterHover from '@/components/ui/ComposterHover.jsx'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

// Circle component for beam icons
const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
    ({ className, children }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "z-10 flex size-14 sm:size-16 items-center justify-center rounded-full border-2 border-border/50 bg-zinc-900 p-3 shadow-[0_0_20px_-12px_rgba(139,92,246,0.5)]",
                    className
                )}
            >
                {children}
            </div>
        )
    }
)
Circle.displayName = "Circle"

// Copy command component
const CopyCommand = ({ command }: { command: string }) => {
    const [copied, setCopied] = React.useState(false)
    
    const handleCopy = async () => {
        await navigator.clipboard.writeText(command)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    
    return (
        <div className="flex items-center gap-3 bg-[#0d0d0d] border border-border/30 rounded-xl px-4 py-3 sm:px-6 sm:py-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <code className="flex-1 text-sm sm:text-base font-mono text-zinc-300 overflow-x-auto">
                {command}
            </code>
            <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-muted-foreground hover:text-foreground"
            >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
        </div>
    )
}

// VSCode Icon
const VSCodeIcon = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor">
        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" fill="#007ACC"/>
    </svg>
)

// Terminal Icon
const TerminalIcon = () => (
    <Terminal className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-300" />
)

// Warp Icon (using image from public folder)
const WarpIcon = () => (
    <img src="/warp.png" alt="Warp" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
)

// Folder paper items for "Your Components Vault"
const FolderPaperItem = ({ text }: { text: string }) => (
    <div className="w-full h-full flex items-center justify-center">
        <span className="text-[8px] sm:text-[10px] font-bold text-zinc-800 uppercase tracking-wide">
            {text}
        </span>
    </div>
)

// Animated Beam Section
const AnimatedBeamSection = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const div1Ref = useRef<HTMLDivElement>(null)
    const div2Ref = useRef<HTMLDivElement>(null)
    const div3Ref = useRef<HTMLDivElement>(null)
    const div4Ref = useRef<HTMLDivElement>(null)
    const div5Ref = useRef<HTMLDivElement>(null)
    const div6Ref = useRef<HTMLDivElement>(null)
    const div7Ref = useRef<HTMLDivElement>(null)

    const folderItems = [
        <FolderPaperItem key="your" text="Your" />,
        <FolderPaperItem key="vault" text="Vault" />,
        <FolderPaperItem key="components" text="Components" />
    ]

    return (
        <div
            ref={containerRef}
            className="relative flex h-[350px] sm:h-[420px] w-full items-center justify-center overflow-hidden"
        >
            <div className="flex size-full max-h-[300px] sm:max-h-[340px] max-w-lg flex-col items-stretch justify-between gap-8 sm:gap-10">
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div1Ref}>
                        <VSCodeIcon />
                    </Circle>
                    <Circle ref={div5Ref}>
                        <GithubCopilot size={32} />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div2Ref}>
                        <Cursor size={32} />
                    </Circle>
                    <div ref={div4Ref} className="z-10">
                        <Folder size={1.5} color="#8B5CF6" items={folderItems} />
                    </div>
                    <Circle ref={div6Ref}>
                        <Qwen.Color size={32} />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div3Ref}>
                        <TerminalIcon />
                    </Circle>
                    <Circle ref={div7Ref}>
                        <WarpIcon />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} curvature={-75} endYOffset={-10} />
            <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
            <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
            <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div4Ref} curvature={-75} endYOffset={-10} reverse />
            <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} reverse />
            <AnimatedBeam containerRef={containerRef} fromRef={div7Ref} toRef={div4Ref} curvature={75} endYOffset={10} reverse />
        </div>
    )
}

// Footer component
const Footer = () => {
    return (
        <footer className="border-t border-border/30 bg-[#09090b]">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <ComposterHover size={32} />
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-sm mb-6">
                            Your personal vault for React components. Upload, organize, and retrieve instantly with CLI and dashboard.
                        </p>
                        <a 
                            href="https://github.com/binit2-1/Composter" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-zinc-900 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                        >
                            <Github size={18} />
                            <span>Star on GitHub</span>
                        </a>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
                            <li><Link to="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
                            <li><Link to="/app/components" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Components</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-foreground mb-4">Account</h4>
                        <ul className="space-y-3">
                            <li><Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
                            <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
                            <li><Link to="/app/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/30 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Composter. Built with ❤️
                    </p>
                    <a 
                        href="https://github.com/binit2-1/Composter" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        github.com/binit2-1/Composter
                    </a>
                </div>
            </div>
        </footer>
    )
}

export function HeroSection() {
    return (
        <div className="relative w-full overflow-x-hidden bg-background">
            <HeroHeader />
            <main className="relative">
                {/* Purple glow effects - contained within viewport */}
                <div
                    aria-hidden
                    className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-1/4 -left-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[radial-gradient(circle,hsla(262,83%,58%,.12)_0%,transparent_70%)] opacity-70" />
                    <div className="absolute top-1/4 -right-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[radial-gradient(circle,hsla(262,83%,58%,.1)_0%,transparent_70%)] opacity-60" />
                    <div className="absolute bottom-0 left-1/4 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-[radial-gradient(circle,hsla(280,83%,58%,.08)_0%,transparent_70%)] blur-2xl opacity-50" />
                </div>
                
                {/* Hero Section */}
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        to="/docs#mcp-overview"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">MCP for better developer experience</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                        
                                    <h1 className="mt-8 max-w-4xl mx-auto text-balance text-5xl sm:text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-medium">
                                        Your Personal Vault For React Components
                                    </h1>
                                    <p className="mx-auto mt-8 max-w-2xl text-balance text-base sm:text-lg text-muted-foreground">
                                        Upload, organize, and retrieve your components instantly with our CLI and dashboard. Build faster with your reusable component library.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link to="/docs">
                                                <span className="text-nowrap">Browse Docs</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link to="/app">
                                            <span className="text-nowrap">Go to Dashboard</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative mt-8 overflow-hidden px-4 sm:px-2 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/50 p-3 sm:p-4 shadow-lg shadow-zinc-950/15">
                                    <img
                                        className="bg-background aspect-video relative rounded-xl w-full"
                                        src="/cli_tool.gif"
                                        alt="Composter CLI demo"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>

                {/* Section 1: Instant Provisioning */}
                <section className="py-20 md:py-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Left: Text */}
                            <div className="space-y-6">
                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-foreground">
                                    Instant<br />
                                    <span className="bg-linear-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                                        Provisioning
                                    </span>
                                </h2>
                                <p className="text-lg sm:text-xl text-muted-foreground max-w-md">
                                    No waiting. No config. Install the CLI globally and start managing your components in seconds.
                                </p>
                            </div>
                            
                            {/* Right: Command */}
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground/70 text-right">
                                    Provisioned in <span className="text-emerald-400 font-medium">300ms</span>
                                </p>
                                <CopyCommand command="npm install -g composter-cli" />
                                <div className="h-px w-full bg-linear-to-r from-transparent via-border/50 to-transparent" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Beam Animation - Works With Your Favorite Tools */}
                <section className="py-20 md:py-32 relative overflow-hidden">
                    <div className="mx-auto max-w-5xl px-6">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
                                Works With Your
                                <span className="block bg-linear-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                                    Favorite Tools
                                </span>
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Now compatible with MCP and your favorite terminal and IDE. Seamlessly integrate with VSCode, Cursor, GitHub Copilot, and more.
                            </p>
                        </div>
                        
                        <AnimatedBeamSection />
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    )
}

const menuItems = [
    { name: 'Docs', href: '/docs' },
    { name: 'Dashboard', href: '/app' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                to="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            to={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link to="/login">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link to="/signup">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link to="/app">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <ComposterHover size={32} />
            <span className="text-xl font-bold text-foreground">Composter</span>
        </div>
    )
}

export default HeroSection
