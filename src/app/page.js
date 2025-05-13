export default function Home() {
  return (
    <div className="fixed inset-0 z-[-1]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/straegy.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
