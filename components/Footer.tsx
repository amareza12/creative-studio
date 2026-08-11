export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-6 text-center text-white/40 text-sm">
      © {new Date().getFullYear()} Creative Studio. All rights reserved.
    </footer>
  );
}